import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpenCheck,
  CreditCard,
  Layers,
  Lock,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import { LearnerShell, PageHeader, StatCard, StatusPill } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { getDashboardFn } from "@/lib/platform-server";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Learner Dashboard | UPQuizBazaar" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const query = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboardFn() });

  return (
    <LearnerShell>
      <PageHeader eyebrow="Learner home" title="Dashboard">
        <Link
          to="/tests"
          className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          Start a test
        </Link>
      </PageHeader>
      {query.isLoading && <LoadingState label="Loading your dashboard" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tests taken" value={query.data.stats.testsTaken} />
            <StatCard label="Average score" value={`${query.data.stats.averageScore}%`} />
            <StatCard label="Exam bundles" value={query.data.examBundles.length} />
            <StatCard label="Leaderboard rank" value={`#${query.data.stats.rank}`} />
          </div>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Master package map
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-ink">Your UP exams workspace</h2>
              </div>
              <StatusPill>6 bundles · 350 mocks · daily quiz plans</StatusPill>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {query.data.examBundles.map((bundle) => (
                <article
                  key={bundle.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-ink">{bundle.title}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
                        {bundle.tier}
                      </p>
                    </div>
                    <Target className="size-5 shrink-0 text-primary" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {bundle.subjectsCount} subjects · {bundle.pyqQuestions} PYQs · {bundle.mocks}{" "}
                    mocks
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {bundle.dailyPlan}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-lg font-extrabold text-ink">Recommended tests</h2>
              <div className="mt-4 grid gap-3">
                {query.data.recommendedTests.map((test) => (
                  <Link
                    key={test.id}
                    to={test.isUnlocked ? "/tests/$testSlug" : "/checkout/$plan"}
                    params={test.isUnlocked ? { testSlug: test.slug } : { plan: test.packageSlug }}
                    search={test.isUnlocked ? undefined : { exam: test.examCode ?? "UPTET_CTET" }}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                  >
                    <div>
                      <p className="font-bold text-ink">{test.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.durationMinutes} min · {test.questionCount} questions
                      </p>
                    </div>
                    {test.isUnlocked ? (
                      <ArrowRight className="size-4 text-primary" />
                    ) : (
                      <Lock className="size-4 text-muted-foreground" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-lg font-extrabold text-ink">Syllabus focus</h2>
              <div className="mt-4 space-y-3">
                {query.data.syllabusFocus.map((focus) => {
                  const bundle = query.data.examBundles.find((item) => item.id === focus.bundleId);
                  return (
                    <div key={focus.bundleId} className="rounded-xl bg-secondary p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-ink">{bundle?.title ?? focus.bundleId}</p>
                        <StatusPill>
                          {focus.completed}/{focus.total}
                        </StatusPill>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {focus.nextTopics.map((topic) => (
                          <li key={topic} className="flex gap-2">
                            <Layers className="mt-0.5 size-3.5 shrink-0 text-primary" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { to: "/tests", label: "Catalog", icon: BookOpenCheck },
              { to: "/wrong-questions", label: "Wrong review", icon: XCircle },
              { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
              { to: "/purchases", label: "Purchases", icon: CreditCard },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl border border-border bg-card p-5 font-bold text-ink shadow-card"
              >
                <Icon className="mb-3 size-5 text-primary" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </LearnerShell>
  );
}
