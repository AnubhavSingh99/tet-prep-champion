import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpenCheck,
  CreditCard,
  Flame,
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
          className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-black text-white shadow-card"
        >
          Start a test
        </Link>
      </PageHeader>
      {query.isLoading && <LoadingState label="Loading your dashboard" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tests taken" value={query.data.stats.testsTaken} tone="bg-pink-500" />
            <StatCard
              label="Average score"
              value={`${query.data.stats.averageScore}%`}
              tone="bg-emerald-500"
            />
            <StatCard
              label="Exam bundles"
              value={query.data.examBundles.length}
              tone="bg-amber-400"
            />
            <StatCard
              label="Leaderboard rank"
              value={`#${query.data.stats.rank}`}
              tone="bg-sky-500"
            />
          </div>

          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    Recommended
                  </p>
                  <h2 className="mt-1 text-xl font-black text-ink">Start from here</h2>
                </div>
                <Flame className="size-5 text-orange-500" />
              </div>
              <div className="mt-4 grid gap-3">
                {query.data.recommendedTests.slice(0, 4).map((test) => (
                  <Link
                    key={test.id}
                    to={test.isUnlocked ? "/tests/$testSlug" : "/checkout/$plan"}
                    params={test.isUnlocked ? { testSlug: test.slug } : { plan: test.packageSlug }}
                    search={test.isUnlocked ? undefined : { exam: test.examCode ?? "UPTET_CTET" }}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f7f2] p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-black text-ink">{test.title}</p>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {test.durationMinutes} min · {test.questionCount} questions
                      </p>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black text-white">
                      {test.isUnlocked ? (
                        <ArrowRight className="size-4" />
                      ) : (
                        <Lock className="size-4" />
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-[#121212] p-5 text-white shadow-card">
              <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                Syllabus focus
              </p>
              <h2 className="mt-1 text-xl font-black text-white">Next topics</h2>
              <div className="mt-4 space-y-3">
                {query.data.syllabusFocus.slice(0, 3).map((focus) => {
                  const bundle = query.data.examBundles.find((item) => item.id === focus.bundleId);
                  return (
                    <div
                      key={focus.bundleId}
                      className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-white">{bundle?.title ?? focus.bundleId}</p>
                        <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-black text-black">
                          {focus.completed}/{focus.total}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-white/65">
                        {focus.nextTopics.slice(0, 2).join(" • ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-card">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  Exam packages
                </p>
                <h2 className="mt-1 text-xl font-black text-ink">Pick one exam workspace</h2>
              </div>
              <StatusPill>6 exams · exam-wise packages</StatusPill>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {query.data.examBundles.map((bundle, index) => {
                const tones = [
                  "from-orange-500 to-rose-500",
                  "from-sky-500 to-indigo-600",
                  "from-emerald-500 to-teal-600",
                  "from-amber-400 to-orange-500",
                  "from-fuchsia-500 to-violet-600",
                  "from-cyan-500 to-blue-600",
                ];
                return (
                  <article
                    key={bundle.id}
                    className="overflow-hidden rounded-[22px] border border-black/5 bg-[#f8f7f2]"
                  >
                    <div
                      className={`bg-gradient-to-br ${tones[index % tones.length]} p-4 text-white`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-white">{bundle.title}</h3>
                          <p className="mt-1 text-xs font-black uppercase text-white/75">
                            {bundle.tier}
                          </p>
                        </div>
                        <Target className="size-5 shrink-0 text-white/80" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-muted-foreground">
                        {bundle.subjectsCount} subjects · {bundle.pyqQuestions} PYQs ·{" "}
                        {bundle.mocks} mocks
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {bundle.dailyPlan}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-4">
            {[
              { to: "/tests", label: "Catalog", icon: BookOpenCheck, tone: "bg-orange-50" },
              { to: "/wrong-questions", label: "Wrong review", icon: XCircle, tone: "bg-rose-50" },
              { to: "/leaderboard", label: "Leaderboard", icon: Trophy, tone: "bg-amber-50" },
              { to: "/purchases", label: "Purchases", icon: CreditCard, tone: "bg-emerald-50" },
            ].map(({ to, label, icon: Icon, tone }) => (
              <Link
                key={to}
                to={to}
                className={`${tone} rounded-[22px] border border-black/5 p-5 font-black text-ink shadow-card transition-transform hover:-translate-y-0.5`}
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
