import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Play } from "lucide-react";

import { LearnerShell, PageHeader, StatusPill } from "@/components/app-shell";
import { EmptyState } from "@/components/states";
import {
  EXAM_PACKAGE_OPTIONS,
  PACKAGE_PLANS,
  planRank,
  type PlanSlug,
  type TestSummary,
} from "@/lib/platform-model";
import { getCatalogFn } from "@/lib/platform-server";

export const Route = createFileRoute("/tests/")({
  head: () => ({ meta: [{ title: "Exam-wise Test Catalog | UPQuizBazaar" }] }),
  loader: () => getCatalogFn(),
  component: TestsPage,
});

function TestsPage() {
  const catalog = Route.useLoaderData();
  const tests = catalog.tests;
  const freeTests = tests.filter((test) => test.accessKind === "free");

  return (
    <LearnerShell>
      <PageHeader eyebrow="Practice catalog" title="Exam-wise packages and tests" />
      {!tests.length && (
        <EmptyState title="No tests yet">Published tests will appear here.</EmptyState>
      )}
      {!!tests.length && (
        <div className="space-y-8">
          {!!freeTests.length && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Free practice
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-ink">
                    Open daily quiz for all learners
                  </h2>
                </div>
                <StatusPill>No package required</StatusPill>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {freeTests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </section>
          )}

          {EXAM_PACKAGE_OPTIONS.map((exam) => {
            const examTests = tests.filter((test) => test.examCode === exam.code);
            return <ExamSection key={exam.code} exam={exam} tests={examTests} />;
          })}
        </div>
      )}
    </LearnerShell>
  );
}

function ExamSection({
  exam,
  tests,
}: {
  exam: (typeof EXAM_PACKAGE_OPTIONS)[number];
  tests: TestSummary[];
}) {
  const highestRank = Math.max(
    ...tests.filter((test) => isPaidUnlocked(test)).map((test) => planRank(test.packageSlug)),
    -1,
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Exam package</p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink">{exam.name}</h2>
        </div>
        <StatusPill>
          {tests.reduce((sum, test) => sum + test.questionCount, 0)} questions in bank
        </StatusPill>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {PACKAGE_PLANS.map((plan) => {
          const active = highestRank >= planRank(plan.slug);
          return (
            <article key={plan.slug} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-ink">
                    ₹{plan.priceInr} {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{packageScope(plan.slug)}</p>
                </div>
                {active ? (
                  <CheckCircle2 className="size-5 text-jade" />
                ) : (
                  <Lock className="size-5 text-muted-foreground" />
                )}
              </div>
              <Link
                to="/checkout/$plan"
                params={{ plan: plan.slug }}
                search={{ exam: exam.code }}
                className={
                  active
                    ? "mt-4 inline-flex w-full justify-center rounded-full border border-jade/30 bg-jade/10 px-4 py-2 text-sm font-bold text-jade"
                    : "mt-4 inline-flex w-full justify-center rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream"
                }
              >
                {active ? "Active for this exam" : `Unlock ${exam.name}`}
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {PACKAGE_PLANS.map((plan) => (
          <PlanTestLane
            key={plan.slug}
            examCode={exam.code}
            plan={plan}
            tests={tests.filter((test) => test.packageSlug === plan.slug)}
          />
        ))}
      </div>
    </section>
  );
}

function PlanTestLane({
  examCode,
  plan,
  tests,
}: {
  examCode: string;
  plan: (typeof PACKAGE_PLANS)[number];
  tests: TestSummary[];
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {plan.name} content
          </p>
          <h3 className="mt-1 font-extrabold text-ink">{packageScope(plan.slug)}</h3>
        </div>
        <StatusPill>{tests.length} tests</StatusPill>
      </div>
      <div className="mt-4 space-y-3">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
        {!tests.length && (
          <Link
            to="/checkout/$plan"
            params={{ plan: plan.slug }}
            search={{ exam: examCode }}
            className="inline-flex w-full justify-center rounded-full border border-border bg-card px-4 py-3 text-sm font-bold text-ink"
          >
            Unlock package
          </Link>
        )}
      </div>
    </section>
  );
}

function TestCard({ test }: { test: TestSummary }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <StatusPill>{test.categoryName}</StatusPill>
        {test.isUnlocked ? (
          <StatusPill>Open</StatusPill>
        ) : (
          <Lock className="size-4 text-muted-foreground" />
        )}
      </div>
      <h4 className="mt-3 font-extrabold text-ink">{test.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{test.description}</p>
      <p className="mt-3 text-sm font-semibold text-ink">
        {test.durationMinutes} min · {test.questionCount} questions · {test.totalMarks} marks
      </p>
      {test.isUnlocked ? (
        <Link
          to="/tests/$testSlug"
          params={{ testSlug: test.slug }}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          <Play className="mr-2 size-4" />
          Start / resume
        </Link>
      ) : (
        <Link
          to="/checkout/$plan"
          params={{ plan: test.packageSlug }}
          search={{ exam: test.examCode ?? "UPTET_CTET" }}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-ink"
        >
          <Lock className="mr-2 size-4" />
          Unlock package
        </Link>
      )}
    </article>
  );
}

function packageScope(plan: PlanSlug): string {
  if (plan === "starter") return "Daily + subject practice";
  if (plan === "complete") return "Starter + PYQ practice";
  return "Complete + full mocks";
}

function isPaidUnlocked(test: { isUnlocked: boolean; accessKind?: "free" | "paid" }): boolean {
  return test.isUnlocked && test.accessKind === "paid";
}
