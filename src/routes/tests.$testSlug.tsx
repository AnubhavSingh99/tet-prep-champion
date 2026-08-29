import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Grid3X3,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";

import { StatusPill } from "@/components/app-shell";
import { ErrorState } from "@/components/states";
import { getTestRunnerFn, submitAttemptFn } from "@/lib/platform-server";

export const Route = createFileRoute("/tests/$testSlug")({
  head: () => ({ meta: [{ title: "Take Test | UPQuizBazaar" }] }),
  loader: ({ params }) => getTestRunnerFn({ data: { testSlug: params.testSlug } }),
  component: TestRunnerPage,
});

function TestRunnerPage() {
  const runner = Route.useLoaderData();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const mutation = useMutation({
    mutationFn: () => {
      if (!runner.attempt) throw new Error("Attempt unavailable");
      return submitAttemptFn({ data: { attemptId: runner.attempt.id, answers } });
    },
    onSuccess: (result) => {
      void navigate({ to: "/attempts/$attemptId", params: { attemptId: result.id } });
    },
  });
  const allQuestions = runner.questions;
  const subjectChips = useMemo(
    () => ["All", ...new Set(allQuestions.map((question) => question.subject).filter(Boolean))],
    [allQuestions],
  );
  const questions = useMemo(
    () =>
      subjectFilter === "All"
        ? allQuestions
        : allQuestions.filter((question) => question.subject === subjectFilter),
    [allQuestions, subjectFilter],
  );
  const currentQuestion = questions[currentIndex];
  const answered = useMemo(() => Object.keys(answers).length, [answers]);
  const answeredAndMarked = questions.filter(
    (question) => answers[question.id] && marked[question.id],
  ).length;
  const markedOnly = questions.filter(
    (question) => !answers[question.id] && marked[question.id],
  ).length;
  const notAnswered = questions.filter(
    (question) => visited[question.id] && !answers[question.id] && !marked[question.id],
  ).length;
  const notVisited = questions.filter((question) => !visited[question.id]).length;

  function moveTo(index: number) {
    const nextIndex = Math.max(0, Math.min(index, questions.length - 1));
    const nextQuestion = questions[nextIndex];
    setCurrentIndex(nextIndex);
    if (nextQuestion) {
      setVisited((current) => ({ ...current, [nextQuestion.id]: true }));
    }
  }

  function paletteClass(questionId: string, index: number) {
    if (index === currentIndex) return "bg-red-500 text-white ring-2 ring-red-200";
    if (answers[questionId] && marked[questionId]) return "bg-blue-500 text-white";
    if (answers[questionId]) return "bg-jade text-white";
    if (marked[questionId]) return "bg-violet-600 text-white";
    if (visited[questionId]) return "bg-red-100 text-red-600";
    return "bg-secondary text-muted-foreground";
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-3 py-4 text-foreground sm:px-5 lg:px-8">
      {runner.locked && (
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-border bg-card p-6 text-center shadow-card">
            <ErrorState title="Package required">
              This test belongs to the {runner.test?.packageSlug} package. Purchase the package
              before starting the timed test.
            </ErrorState>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/checkout/$plan"
                params={{ plan: runner.test?.packageSlug ?? "premium" }}
                search={{ exam: runner.test?.examCode ?? "UPTET_CTET" }}
                className="inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                Unlock package
              </Link>
              <Link
                to="/tests"
                className="inline-flex justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-ink"
              >
                Back to catalog
              </Link>
            </div>
          </div>
        </div>
      )}
      {!runner.locked && currentQuestion && (
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-white/90 p-3 shadow-[0_18px_60px_-40px_rgba(20,20,20,0.45)] sm:p-5">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-sm font-extrabold text-cream">
              <Clock className="size-4" />
              02:29:59
              <span className="text-xs font-semibold text-cream/65">Time Left</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>
                {answered}/{questions.length} · {Math.round((answered / questions.length) * 100)}%
              </span>
              <span className="rounded-full bg-jade/10 px-3 py-1 text-jade">
                No Negative Marking
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                <AlertTriangle className="size-3.5" />
                Don't refresh! Timer keeps running
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-ink">
                <Grid3X3 className="size-3.5" />
                Question Palette
              </span>
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <main className="min-w-0">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-2">
                  {subjectChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSubjectFilter(chip);
                        setCurrentIndex(0);
                      }}
                      className={
                        "rounded-full border px-4 py-2 text-xs font-bold shadow-sm transition-colors " +
                        (chip === subjectFilter
                          ? "border-ink bg-ink text-cream"
                          : "border-border bg-card text-ink hover:border-primary/40")
                      }
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex rounded-full border border-border bg-card p-1 shadow-sm">
                    {[
                      ["english", "English"],
                      ["hindi", "Hindi"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setLanguage(value as "english" | "hindi")}
                        className={
                          "rounded-full px-4 py-1.5 text-xs font-extrabold transition-colors " +
                          (language === value
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-ink")
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 self-start rounded-full text-xs font-semibold text-muted-foreground sm:self-auto">
                    <BookOpen className="size-4" />
                    {questions.length} Qs in this filter · {runner.test?.examName ?? "Mock test"}
                  </div>
                </div>
              </div>

              <article className="rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-extrabold text-cream">
                      {currentIndex + 1}
                    </span>
                    <StatusPill>
                      {currentQuestion.subject ?? runner.test?.categoryName ?? "Mock"}
                    </StatusPill>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-primary">
                      {currentQuestion.difficulty ?? "Medium"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setMarked((current) => ({
                          ...current,
                          [currentQuestion.id]: !current[currentQuestion.id],
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700"
                    >
                      <Flag className="size-4" />
                      Mark for Review
                    </button>
                    <button
                      onClick={() =>
                        setAnswers((current) => {
                          const next = { ...current };
                          delete next[currentQuestion.id];
                          return next;
                        })
                      }
                      className="rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-muted-foreground"
                    >
                      Clear Response
                    </button>
                  </div>
                </div>

                <div className="py-6">
                  <p className="mb-5 text-lg font-extrabold leading-relaxed text-ink">
                    <span className="mr-2 inline-block text-xs font-bold text-blue-600">
                      {language === "english" ? "EN" : "हि"}
                    </span>
                    {language === "english"
                      ? currentQuestion.prompt
                      : getHindiPrompt(currentQuestion.prompt)}
                  </p>

                  <div className="grid gap-3">
                    {currentQuestion.options.map((option, optionIndex) => (
                      <label
                        key={option}
                        className={
                          "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all " +
                          (answers[currentQuestion.id] === option
                            ? "border-primary bg-primary/10 text-ink shadow-card"
                            : "border-border bg-background text-ink hover:border-primary/50")
                        }
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          aria-label={option}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() => {
                            setVisited((current) => ({ ...current, [currentQuestion.id]: true }));
                            setAnswers((current) => ({
                              ...current,
                              [currentQuestion.id]: option,
                            }));
                          }}
                          className="sr-only"
                        />
                        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-xs font-extrabold text-muted-foreground">
                          {["A", "B", "C", "D", "E"][optionIndex]}
                        </span>
                        <span>{language === "english" ? option : getHindiOption(option)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <footer className="flex flex-col-reverse justify-between gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center">
                  <button
                    onClick={() => moveTo(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-muted-foreground disabled:opacity-45"
                  >
                    <ChevronLeft className="mr-2 size-4" />
                    Previous
                  </button>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => moveTo(currentIndex + 1)}
                      className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"
                    >
                      Save & Next
                    </button>
                    <button
                      onClick={() => moveTo(currentIndex + 1)}
                      disabled={currentIndex === questions.length - 1}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-ink disabled:opacity-45"
                    >
                      Next
                      <ChevronRight className="ml-2 size-4" />
                    </button>
                  </div>
                </footer>
              </article>
            </main>

            <aside className="rounded-3xl border border-border bg-card p-4 shadow-card lg:sticky lg:top-5 lg:self-start">
              <div className="flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Eye className="size-4" />
                  Question Palette · {questions.length} Q
                </h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-ink">
                  {Math.round((answered / questions.length) * 100)}% done
                </span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => moveTo(index)}
                    className={
                      "grid aspect-square place-items-center rounded-xl text-sm font-extrabold transition-transform hover:-translate-y-0.5 " +
                      paletteClass(question.id, index)
                    }
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border pb-5 text-xs font-semibold text-muted-foreground">
                <Legend color="bg-jade" label="Answered" value={answered - answeredAndMarked} />
                <Legend color="bg-red-500" label="Not Answered" value={notAnswered} />
                <Legend color="bg-violet-600" label="Marked" value={markedOnly} />
                <Legend color="bg-blue-500" label="Answered & Marked" value={answeredAndMarked} />
                <Legend color="bg-secondary" label="Not Visited" value={notVisited} />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Questions: {questions.length}</span>
                  <span>{answered} answered</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(answered / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {mutation.isError && (
                <div className="mt-4">
                  <ErrorState title="Submission failed">{mutation.error.message}</ErrorState>
                </div>
              )}
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-extrabold text-white shadow-card disabled:opacity-60"
              >
                <Send className="mr-2 size-4" />
                Submit Test · {answered}/{questions.length}
              </button>
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
                Structure supports {questions.length} Q · Demo {questions.length} Qs · Paper 1
              </p>
              <Link
                to="/tests"
                className="mt-3 inline-flex w-full justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-ink"
              >
                Exit test
              </Link>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2">
        <span className={"size-2.5 rounded-full " + color} />
        {label}
      </span>
      <span className="font-extrabold text-ink">{value}</span>
    </div>
  );
}

function getHindiPrompt(prompt: string): string {
  if (prompt.includes("child-centred")) {
    return "बाल-केंद्रित शिक्षा का सबसे अच्छा समर्थन कौन सा सिद्धांत करता है?";
  }
  if (prompt.includes("formative")) {
    return "रचनात्मक मूल्यांकन का मुख्य उपयोग किस लिए किया जाता है?";
  }
  if (prompt.includes("prime")) {
    return "इनमें से अभाज्य संख्या कौन सी है?";
  }
  return "इस प्रश्न को ध्यान से पढ़ें और सही विकल्प चुनें।";
}

function getHindiOption(option: string): string {
  const translations: Record<string, string> = {
    "Memorisation first": "पहले रटना",
    "Learning by doing": "करके सीखना",
    "Punishment for errors": "गलतियों पर दंड",
    "One-way lecture": "एकतरफा व्याख्यान",
    "Rank students only": "केवल रैंक देना",
    "Improve learning during instruction": "सीखने में सुधार",
    "Replace all exams": "सभी परीक्षाओं को बदलना",
    "Select teachers": "शिक्षक चुनना",
  };
  return translations[option] ?? "विकल्प";
}
