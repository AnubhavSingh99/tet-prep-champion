import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { LearnerShell, PageHeader, StatCard } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { getAttemptResultFn } from "@/lib/platform-server";

export const Route = createFileRoute("/attempts/$attemptId")({
  head: () => ({ meta: [{ title: "Result & Solutions | UPQuizBazaar" }] }),
  component: AttemptResultPage,
});

function AttemptResultPage() {
  const { attemptId } = Route.useParams();
  const query = useQuery({
    queryKey: ["attempt-result", attemptId],
    queryFn: () => getAttemptResultFn({ data: { attemptId } }),
  });

  return (
    <LearnerShell>
      {query.isLoading && <LoadingState label="Loading result and solutions" />}
      {query.isError && <ErrorState title="Result unavailable">{query.error.message}</ErrorState>}
      {query.data && (
        <>
          <PageHeader eyebrow="Result analysis" title={query.data.testTitle}>
            <Link
              to="/tests"
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              <RotateCcw className="mr-2 size-4" />
              Re-attempt from catalog
            </Link>
          </PageHeader>
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard label="Score" value={`${query.data.score ?? 0}`} />
            <StatCard label="Percentage" value={`${query.data.percentage ?? 0}%`} />
            <StatCard label="Correct" value={query.data.correctCount ?? 0} />
            <StatCard label="Wrong" value={query.data.wrongCount ?? 0} />
          </div>
          <section className="mt-6 space-y-4">
            {query.data.questions.map((question, index) => (
              <article
                key={question.questionId}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-extrabold text-ink">
                    Q{index + 1}. {question.prompt}
                  </h2>
                  {question.isCorrect ? (
                    <CheckCircle2 className="size-5 shrink-0 text-jade" />
                  ) : (
                    <XCircle className="size-5 shrink-0 text-destructive" />
                  )}
                </div>
                <div className="mt-4 grid gap-2">
                  {question.options.map((option) => {
                    const selected = question.selected === option;
                    const correct = question.correctAnswer === option;
                    return (
                      <div
                        key={option}
                        className={
                          "rounded-xl border px-4 py-3 text-sm font-semibold " +
                          (correct
                            ? "border-jade/40 bg-jade/10 text-ink"
                            : selected
                              ? "border-destructive/40 bg-destructive/10 text-ink"
                              : "border-border bg-background text-muted-foreground")
                        }
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 rounded-xl bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-ink">Solution:</strong> {question.explanation}
                </p>
              </article>
            ))}
          </section>
        </>
      )}
    </LearnerShell>
  );
}
