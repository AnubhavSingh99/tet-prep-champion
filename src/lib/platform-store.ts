import {
  CATEGORIES,
  EXAM_PACKAGE_OPTIONS,
  PACKAGE_PLANS,
  UP_EXAM_BUNDLES,
  type AdminOverview,
  type Attempt,
  type AttemptResult,
  type DashboardData,
  type Entitlement,
  type LeaderboardEntry,
  type LearnerProfile,
  type PackagePlan,
  type PaymentRecord,
  type PlanSlug,
  type PublicQuestion,
  type Question,
  type TestSummary,
  getPlan,
  planRank,
} from "./platform-model";
import { GENERATED_MOCK_QUESTIONS, type GeneratedMockQuestion } from "./generated-mock-bank";

const DEMO_USER_ID = "demo-user";
const DEMO_NOW = "2026-08-29T07:00:00.000Z";

const FREE_DAILY_TEST_SLUG = "free-daily-current-affairs";

type BankTest = TestSummary & {
  questions: Question[];
};

const EXAM_META: Record<string, { name: string; fullDuration: number; subjectDuration: number }> = {
  UP_PCS: { name: "UP PCS", fullDuration: 120, subjectDuration: 35 },
  RO_ARO: { name: "UPPSC RO/ARO", fullDuration: 120, subjectDuration: 30 },
  UPTET_CTET: { name: "UPTET / CTET", fullDuration: 150, subjectDuration: 25 },
  UP_PET: { name: "UPSSSC PET", fullDuration: 120, subjectDuration: 25 },
  UP_Lekhpal: { name: "UP Lekhpal", fullDuration: 120, subjectDuration: 25 },
  UP_Police: { name: "UP Police", fullDuration: 120, subjectDuration: 25 },
};

const TEST_TYPE_LABELS: Record<string, string> = {
  Full_Mock: "Full Length Mock",
  Subject_Mock: "Subject Mock",
  PYQ: "PYQ Practice",
  Daily_Quiz: "Daily Quiz",
};

const ALL_TESTS = buildBankTests();
const FREE_DAILY_TEST =
  ALL_TESTS.find((test) => test.slug === FREE_DAILY_TEST_SLUG) ?? ALL_TESTS[0];

const demoProfile: LearnerProfile = {
  id: DEMO_USER_ID,
  email: "learner@upquizbazaar.example",
  fullName: "Demo Learner",
  examGoal: "UPTET / CTET 2026",
  roles: ["learner", "admin"],
};

let demoEntitlements: Entitlement[] = [];

let demoPurchases: PaymentRecord[] = [];

let demoAttempts: Attempt[] = [
  {
    id: "attempt_demo_1",
    testId: FREE_DAILY_TEST?.id ?? "test_free_daily_current_affairs",
    testTitle: FREE_DAILY_TEST?.title ?? "Free Daily Current Affairs Quiz",
    status: "submitted",
    answers: demoAnswersFor(FREE_DAILY_TEST),
    score: 2,
    percentage: 67,
    correctCount: 2,
    wrongCount: 1,
    startedAt: DEMO_NOW,
    expiresAt: "2026-08-29T07:25:00.000Z",
    submittedAt: "2026-08-29T07:12:00.000Z",
  },
];

function buildBankTests(): BankTest[] {
  const tests: BankTest[] = [];
  const freeQuestions = GENERATED_MOCK_QUESTIONS.filter(
    (question) => question.type === "Daily_Quiz" && question.subject === "Current",
  ).slice(0, 20);

  tests.push({
    id: "test_free_daily_current_affairs",
    slug: FREE_DAILY_TEST_SLUG,
    title: "Free Daily Current Affairs Quiz",
    description: "A free daily current affairs set sampled from the complete UP exam bank.",
    examCode: "ALL",
    examName: "All UP Exams",
    subject: "Current Affairs",
    testType: "Free_Demo",
    accessKind: "free",
    categorySlug: "current-affairs",
    categoryName: "Current Affairs",
    packageSlug: "starter",
    durationMinutes: 15,
    totalMarks: freeQuestions.length,
    questionCount: freeQuestions.length,
    isUnlocked: true,
    questions: freeQuestions.map((question) =>
      toQuestion(question, "test_free_daily_current_affairs"),
    ),
  });

  for (const [examCode, meta] of Object.entries(EXAM_META)) {
    const examQuestions = GENERATED_MOCK_QUESTIONS.filter((question) => question.exam === examCode);
    for (const testType of ["Full_Mock", "PYQ", "Daily_Quiz"] as const) {
      const groupedQuestions = examQuestions.filter((question) => question.type === testType);
      if (!groupedQuestions.length) continue;
      const testId = `test_${slugify(examCode)}_${slugify(testType)}`;
      tests.push({
        id: testId,
        slug: `${slugify(examCode)}-${slugify(testType)}`,
        title: `${meta.name} ${TEST_TYPE_LABELS[testType]}`,
        description: `${groupedQuestions.length} ${TEST_TYPE_LABELS[testType].toLowerCase()} questions from the uploaded bank.`,
        examCode,
        examName: meta.name,
        subject:
          testType === "Full_Mock"
            ? "All Subjects"
            : testType === "PYQ"
              ? "Previous Year Questions"
              : "Daily Practice",
        testType,
        accessKind: "paid",
        categorySlug: slugify(testType),
        categoryName: TEST_TYPE_LABELS[testType],
        packageSlug: requiredPlanForTestType(testType),
        durationMinutes: testType === "Full_Mock" ? meta.fullDuration : meta.subjectDuration,
        totalMarks: groupedQuestions.length,
        questionCount: groupedQuestions.length,
        isUnlocked: false,
        questions: groupedQuestions.map((question) => toQuestion(question, testId)),
      });
    }

    const subjects = [...new Set(examQuestions.map((question) => question.subject))].sort();
    for (const subject of subjects) {
      const subjectQuestions = examQuestions.filter(
        (question) => question.subject === subject && question.type === "Subject_Mock",
      );
      if (!subjectQuestions.length) continue;
      const testId = `test_${slugify(examCode)}_${slugify(subject)}_subject_mock`;
      tests.push({
        id: testId,
        slug: `${slugify(examCode)}-${slugify(subject)}-subject-mock`,
        title: `${meta.name} ${displaySubject(subject)} Subject Mock`,
        description: `${subjectQuestions.length} subject-wise questions for ${displaySubject(subject)}.`,
        examCode,
        examName: meta.name,
        subject: displaySubject(subject),
        testType: "Subject_Mock",
        accessKind: "paid",
        categorySlug: slugify(subject),
        categoryName: displaySubject(subject),
        packageSlug: "starter",
        durationMinutes: meta.subjectDuration,
        totalMarks: subjectQuestions.length,
        questionCount: subjectQuestions.length,
        isUnlocked: false,
        questions: subjectQuestions.map((question) => toQuestion(question, testId)),
      });
    }
  }

  return tests;
}

function toQuestion(question: GeneratedMockQuestion, testId: string): Question {
  const options = [
    question.options.A,
    question.options.B,
    question.options.C,
    question.options.D,
  ].filter(Boolean);
  return {
    id: `${testId}_${question.q_id}`,
    testId,
    prompt: question.question,
    options,
    correctAnswer: question.correct_text || question.options[question.correct_option as "A"],
    explanation:
      question.explanation ||
      `${question.correct_option ? `Correct option: ${question.correct_option}. ` : ""}${question.correct_text}`,
    subject: displaySubject(question.subject),
    difficulty: question.difficulty,
    yearTag: question.year_tag,
    questionType: question.type as Question["questionType"],
    marks: 1,
  };
}

function demoAnswersFor(test: BankTest | undefined): Record<string, string> {
  if (!test) return {};
  const answers: Record<string, string> = {};
  for (const [index, question] of test.questions.slice(0, 3).entries()) {
    answers[question.id] =
      index === 1 ? question.options[1] || question.correctAnswer : question.correctAnswer;
  }
  return answers;
}

function slugify(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function displaySubject(subject: string): string {
  return subject
    .replace(/^UPGK$/, "UP GK")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function requiredPlanForTestType(testType: string): PlanSlug {
  if (testType === "Full_Mock") return "premium";
  if (testType === "PYQ") return "complete";
  return "starter";
}

function getExamOption(examCode: string) {
  return EXAM_PACKAGE_OPTIONS.find((exam) => exam.code === examCode);
}

export function isCloudConfigured(): boolean {
  return Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]);
}

export function getPackages(): PackagePlan[] {
  return PACKAGE_PLANS;
}

export function getTestsForLearner(entitlements = demoEntitlements): TestSummary[] {
  const activeRanksByExam = new Map<string, number>();
  for (const entitlement of entitlements.filter((e) => e.status === "active" && e.examCode)) {
    activeRanksByExam.set(
      entitlement.examCode!,
      Math.max(
        activeRanksByExam.get(entitlement.examCode!) ?? -1,
        planRank(entitlement.packageSlug),
      ),
    );
  }
  return ALL_TESTS.map((test) => {
    const isFreeDemo = test.accessKind === "free";
    const activeExamRank = test.examCode ? (activeRanksByExam.get(test.examCode) ?? -1) : -1;
    return {
      id: test.id,
      slug: test.slug,
      title: test.title,
      description: test.description,
      examCode: test.examCode,
      examName: test.examName,
      subject: test.subject,
      testType: test.testType,
      accessKind: test.accessKind,
      categorySlug: test.categorySlug,
      categoryName: test.categoryName,
      packageSlug: test.packageSlug,
      durationMinutes: test.durationMinutes,
      totalMarks: test.totalMarks,
      questionCount: test.questions.length,
      isUnlocked:
        isFreeDemo || (test.examCode !== "ALL" && planRank(test.packageSlug) <= activeExamRank),
    };
  });
}

export function getDashboard(): DashboardData {
  const submitted = demoAttempts.filter((attempt) => attempt.status === "submitted");
  const averageScore = submitted.length
    ? Math.round(
        submitted.reduce((sum, attempt) => sum + (attempt.percentage ?? 0), 0) / submitted.length,
      )
    : 0;

  return {
    profile: demoProfile,
    entitlements: demoEntitlements,
    purchases: demoPurchases,
    attempts: demoAttempts,
    recommendedTests: getTestsForLearner()
      .sort((a, b) => Number(b.isUnlocked) - Number(a.isUnlocked))
      .slice(0, 3),
    examBundles: UP_EXAM_BUNDLES,
    syllabusFocus: UP_EXAM_BUNDLES.slice(0, 4).map((bundle, index) => ({
      bundleId: bundle.id,
      completed: index + 1,
      total: bundle.syllabus.length,
      nextTopics: bundle.syllabus.slice(0, 2),
    })),
    stats: {
      testsTaken: submitted.length,
      averageScore,
      wrongQuestions: submitted.reduce((sum, attempt) => sum + (attempt.wrongCount ?? 0), 0),
      rank: 28,
    },
  };
}

export function getTestRunner(testSlug: string) {
  const test = ALL_TESTS.find((item) => item.slug === testSlug);
  if (!test) return undefined;
  const summary = getTestsForLearner().find((item) => item.slug === testSlug);
  if (!summary?.isUnlocked) {
    return {
      locked: true as const,
      test: summary,
      questions: [],
      attempt: undefined,
    };
  }
  const publicQuestions: PublicQuestion[] = test.questions.map(
    ({ correctAnswer, explanation, ...question }) => question,
  );
  return {
    locked: false as const,
    test: summary,
    questions: publicQuestions,
    attempt: getOrCreateAttempt(test.id, test.title, test.durationMinutes),
  };
}

function getOrCreateAttempt(testId: string, testTitle: string, durationMinutes: number): Attempt {
  const active = demoAttempts.find(
    (attempt) => attempt.testId === testId && attempt.status === "in_progress",
  );
  if (active) return active;
  const startedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + durationMinutes * 60_000).toISOString();
  const attempt: Attempt = {
    id: `attempt_${Date.now()}`,
    testId,
    testTitle,
    status: "in_progress",
    answers: {},
    startedAt,
    expiresAt,
  };
  demoAttempts = [attempt, ...demoAttempts];
  return attempt;
}

export function submitAttempt(input: {
  attemptId: string;
  answers: Record<string, string>;
}): AttemptResult {
  const attempt = demoAttempts.find((item) => item.id === input.attemptId);
  if (!attempt) throw new Error("Attempt unavailable");
  const test = ALL_TESTS.find((item) => item.id === attempt.testId);
  if (!test) throw new Error("Test unavailable");

  const questions = test.questions.map((question) => {
    const selected = input.answers[question.id];
    return {
      questionId: question.id,
      prompt: question.prompt,
      options: question.options,
      selected,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect: selected === question.correctAnswer,
    };
  });
  const correctCount = questions.filter((question) => question.isCorrect).length;
  const score = correctCount;
  const percentage = Math.round((score / test.questions.length) * 100);
  Object.assign(attempt, {
    answers: input.answers,
    status: "submitted" as const,
    score,
    percentage,
    correctCount,
    wrongCount: test.questions.length - correctCount,
    submittedAt: new Date().toISOString(),
  });
  return { ...attempt, questions };
}

export function getAttemptResult(attemptId: string): AttemptResult | undefined {
  const attempt = demoAttempts.find((item) => item.id === attemptId);
  if (!attempt) return undefined;
  return submitAttempt({ attemptId, answers: attempt.answers });
}

export function getWrongQuestions(): AttemptResult[] {
  return demoAttempts
    .filter((attempt) => attempt.status === "submitted")
    .map((attempt) => getAttemptResult(attempt.id))
    .filter((attempt): attempt is AttemptResult => Boolean(attempt))
    .map((attempt) => ({
      ...attempt,
      questions: attempt.questions.filter((question) => !question.isCorrect),
    }))
    .filter((attempt) => attempt.questions.length > 0);
}

export function getLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, name: "Aarav Singh", score: 96, attempts: 24 },
    { rank: 2, name: "Priya Verma", score: 94, attempts: 21 },
    { rank: 3, name: "Neha Sharma", score: 91, attempts: 20 },
    {
      rank: 28,
      name: demoProfile.fullName,
      score: getDashboard().stats.averageScore,
      attempts: demoAttempts.length,
    },
  ];
}

export function createCheckout(input: { packageSlug: PlanSlug; examCode: string }): PaymentRecord {
  const { packageSlug, examCode } = input;
  const plan = getPlan(packageSlug);
  if (!plan) throw new Error("Package unavailable");
  const exam = getExamOption(examCode);
  if (!exam) throw new Error("Exam unavailable");
  const payment: PaymentRecord = {
    id: `pay_${examCode}_${packageSlug}_${Date.now()}`,
    packageSlug,
    packageName: `${exam.name} ${plan.name}`,
    examCode,
    examName: exam.name,
    amountInr: plan.priceInr,
    status: "pending",
    createdAt: new Date().toISOString(),
    message:
      "Paddle test checkout is waiting for provider confirmation. Access activates only after verified webhook state.",
  };
  demoPurchases = [payment, ...demoPurchases];
  return payment;
}

export function markDemoPaymentVerified(paymentId: string): PaymentRecord {
  const payment = demoPurchases.find((item) => item.id === paymentId);
  if (!payment) throw new Error("Payment unavailable");
  payment.status = "verified";
  payment.message =
    "Verified in test mode. Production requires live Paddle credentials and webhook validation.";
  demoEntitlements = [
    {
      packageSlug: payment.packageSlug,
      packageName: payment.packageName,
      examCode: payment.examCode,
      examName: payment.examName,
      status: "active",
    },
    ...demoEntitlements.filter(
      (item) => !(item.packageSlug === payment.packageSlug && item.examCode === payment.examCode),
    ),
  ];
  return payment;
}

export function getProfile(): LearnerProfile {
  return demoProfile;
}

export function updateProfile(input: { fullName: string; examGoal: string }): LearnerProfile {
  demoProfile.fullName = input.fullName.trim() || demoProfile.fullName;
  demoProfile.examGoal = input.examGoal.trim() || demoProfile.examGoal;
  return demoProfile;
}

export function getAdminOverview(): AdminOverview {
  const tests = getTestsForLearner();
  return {
    metrics: {
      learners: 1284,
      packages: PACKAGE_PLANS.length,
      publishedTests: tests.length,
      questions: GENERATED_MOCK_QUESTIONS.length,
      attempts: demoAttempts.length + 4832,
      verifiedPayments:
        demoPurchases.filter((payment) => payment.status === "verified").length + 719,
      revenueInr: 71281,
    },
    users: [
      demoProfile,
      {
        id: "learner_2",
        email: "priya@example.com",
        fullName: "Priya Verma",
        examGoal: "CTET Paper 1",
        roles: ["learner"],
      },
      {
        id: "learner_3",
        email: "aarav@example.com",
        fullName: "Aarav Singh",
        examGoal: "UPTET 2026",
        roles: ["learner"],
      },
    ],
    packages: PACKAGE_PLANS,
    tests,
    attempts: demoAttempts,
    payments: demoPurchases,
    categories: CATEGORIES,
    settings: [
      { key: "payments.mode", value: "Paddle test mode; live credentials pending" },
      { key: "answer_keys", value: "Hidden during active attempts; results computed server-side" },
      { key: "auth", value: "Email/password and Google via Supabase/Lovable Cloud auth" },
    ],
  };
}
