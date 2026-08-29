import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { LearnerShell, PageHeader } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { getWrongQuestionsFn } from "@/lib/platform-server";

export const Route = createFileRoute("/wrong-questions")({
  head: () => ({ meta: [{ title: "Wrong Questions | UPQuizBazaar" }] }),
  component: WrongQuestionsPage,
});

function WrongQuestionsPage() {
  const query = useQuery({ queryKey: ["wrong-questions"], queryFn: () => getWrongQuestionsFn() });
  return (
    <LearnerShell>
      <PageHeader eyebrow="Revision queue" title="Wrong-question review" />
      {query.isLoading && <LoadingState label="Loading wrong questions" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && !query.data.length && (
        <EmptyState title="No wrong questions yet">
          Submit a test and missed questions will collect here automatically.
        </EmptyState>
      )}
      {query.data && (
        <div className="space-y-4">
          {query.data.map((attempt) => (
            <article
              key={attempt.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-extrabold text-ink">{attempt.testTitle}</h2>
                  <p className="text-sm text-muted-foreground">
                    {attempt.questions.length} questions to revise
                  </p>
                </div>
                <Link
                  to="/tests"
                  className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Re-attempt
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {attempt.questions.map((question) => (
                  <div key={question.questionId} className="rounded-xl bg-secondary p-4">
                    <p className="font-bold text-ink">{question.prompt}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Correct answer: {question.correctAnswer}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </LearnerShell>
  );
}
