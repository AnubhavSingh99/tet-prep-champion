export type Role = "learner" | "admin";
export type AttemptStatus = "in_progress" | "submitted" | "expired";
export type PaymentStatus = "pending" | "verified" | "failed" | "cancelled";
export type EntitlementStatus = "active" | "expired" | "revoked";

export type PlanSlug = "starter" | "complete" | "premium";
export type TestType = "Free_Demo" | "Full_Mock" | "Subject_Mock" | "PYQ" | "Daily_Quiz";

export type ExamBundle = {
  id: string;
  exam: string;
  title: string;
  tier: string;
  subjectsCount: number;
  pyqQuestions: string;
  mocks: number;
  dailyQuizzes: number;
  pattern: string;
  subjects: string[];
  syllabus: string[];
  pyqInsight: string;
  mockPlan: string;
  dailyPlan: string;
};

export type PackagePlan = {
  id: string;
  slug: PlanSlug;
  name: string;
  priceInr: number;
  tagline: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  cta: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type Question = {
  id: string;
  testId: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject?: string;
  difficulty?: string;
  yearTag?: string;
  questionType?: TestType;
  marks: number;
};

export type PublicQuestion = Omit<Question, "correctAnswer" | "explanation">;

export type TestSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  examCode?: string;
  examName?: string;
  subject?: string;
  testType?: TestType;
  accessKind?: "free" | "paid";
  categorySlug: string;
  categoryName: string;
  packageSlug: PlanSlug;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  isUnlocked: boolean;
};

export type Attempt = {
  id: string;
  testId: string;
  testTitle: string;
  status: AttemptStatus;
  answers: Record<string, string>;
  score?: number;
  percentage?: number;
  correctCount?: number;
  wrongCount?: number;
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
};

export type ResultQuestion = {
  questionId: string;
  prompt: string;
  options: string[];
  selected?: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
};

export type AttemptResult = Attempt & {
  questions: ResultQuestion[];
};

export type LearnerProfile = {
  id: string;
  email: string;
  fullName: string;
  examGoal: string;
  roles: Role[];
};

export type PaymentRecord = {
  id: string;
  packageSlug: PlanSlug;
  packageName: string;
  examCode?: string;
  examName?: string;
  amountInr: number;
  status: PaymentStatus;
  createdAt: string;
  message: string;
};

export type Entitlement = {
  packageSlug: PlanSlug;
  packageName: string;
  examCode?: string;
  examName?: string;
  status: EntitlementStatus;
  expiresAt?: string;
};

export type DashboardData = {
  profile: LearnerProfile;
  entitlements: Entitlement[];
  purchases: PaymentRecord[];
  attempts: Attempt[];
  recommendedTests: TestSummary[];
  examBundles: ExamBundle[];
  syllabusFocus: {
    bundleId: string;
    completed: number;
    total: number;
    nextTopics: string[];
  }[];
  stats: {
    testsTaken: number;
    averageScore: number;
    wrongQuestions: number;
    rank: number;
  };
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  attempts: number;
};

export type AdminOverview = {
  metrics: {
    learners: number;
    packages: number;
    publishedTests: number;
    questions: number;
    attempts: number;
    verifiedPayments: number;
    revenueInr: number;
  };
  users: LearnerProfile[];
  packages: PackagePlan[];
  tests: TestSummary[];
  attempts: Attempt[];
  payments: PaymentRecord[];
  categories: Category[];
  settings: { key: string; value: string }[];
};

export const PACKAGE_PLANS: PackagePlan[] = [
  {
    id: "pkg_starter",
    slug: "starter",
    name: "Starter",
    priceInr: 29,
    tagline: "Get started with the essentials.",
    cta: "Buy Starter",
    features: [
      "5 Full Mock Tests",
      "10 Subject Tests",
      "500+ Questions",
      "Basic result analysis",
      "Exam-like timer",
      "Solutions for every question",
    ],
  },
  {
    id: "pkg_complete",
    slug: "complete",
    name: "Complete",
    priceInr: 49,
    tagline: "Most balanced value for serious aspirants.",
    badge: "Best Value",
    cta: "Buy Complete",
    features: [
      "15 Full Mock Tests",
      "40 Subject / Chapter Tests",
      "2,000+ Questions",
      "Previous Year Questions",
      "Detailed explanations",
      "Performance analysis",
      "Wrong-question practice",
    ],
  },
  {
    id: "pkg_premium",
    slug: "premium",
    name: "Premium",
    priceInr: 99,
    tagline: "The complete UP exams quiz workspace.",
    highlight: true,
    badge: "Best Selling",
    cta: "Get Premium",
    features: [
      "30 Full Mock Tests",
      "100+ Chapter / Subject Tests",
      "5,000+ Questions",
      "PYQs with detailed solutions",
      "Daily quizzes",
      "Rank & leaderboard",
      "Wrong-question practice",
      "Unlimited re-attempts",
      "Exam-like interface",
    ],
  },
];

export const EXAM_PACKAGE_OPTIONS = [
  { code: "UP_PCS", name: "UP PCS" },
  { code: "RO_ARO", name: "UPPSC RO/ARO" },
  { code: "UPTET_CTET", name: "UPTET / CTET" },
  { code: "UP_PET", name: "UPSSSC PET" },
  { code: "UP_Lekhpal", name: "UP Lekhpal" },
  { code: "UP_Police", name: "UP Police" },
];

export const UP_EXAM_BUNDLES: ExamBundle[] = [
  {
    id: "UPPCS_COMPLETE",
    exam: "UP PCS",
    title: "UP PCS Complete",
    tier: "Premium",
    subjectsCount: 10,
    pyqQuestions: "1500+",
    mocks: 45,
    dailyQuizzes: 365,
    pattern: "Prelims GS-I and CSAT, Mains Hindi/Essay/GS I-VI, and Interview preparation.",
    subjects: [
      "Prelims GS-I",
      "CSAT Comprehension",
      "Reasoning",
      "Maths",
      "General Hindi",
      "Essay",
      "GS-I History/Culture/Geography/Society",
      "GS-II Polity/Governance/IR",
      "GS-III Economy/S&T/Environment/Security",
      "GS-IV Ethics + GS-V/VI UP Special",
    ],
    syllabus: [
      "Indian History, National Movement, Indian and World Geography",
      "Polity, governance, economy, social development, budget and planning",
      "General Science, environment, ecology, UP GK and current affairs",
      "UP history, culture, governance, economy, geography and disaster management",
    ],
    pyqInsight: "Last 10 years show rising UP-specific weight, with 30-35 UP questions in Prelims.",
    mockPlan: "30 full prelims tests, 15 mains tests, and 10 UP-special mocks.",
    dailyPlan: "10 current affairs + 10 UP GK + 10 rotating subject questions.",
  },
  {
    id: "ROARO_COMPLETE",
    exam: "UPPSC RO/ARO",
    title: "RO/ARO Complete",
    tier: "Premium",
    subjectsCount: 3,
    pyqQuestions: "2000+",
    mocks: 35,
    dailyQuizzes: 300,
    pattern: "Prelims GS + Hindi, Mains GS/Hindi Drafting/Essay, and typing practice.",
    subjects: ["General Studies", "General Hindi", "Hindi Drafting & Essay"],
    syllabus: [
      "History, National Movement, Polity, Economy, Geography, Science and Current Affairs",
      "UP education, culture, agriculture, trade, living and social customs",
      "Hindi grammar, vocabulary, comprehension, official drafting and essay writing",
    ],
    pyqInsight:
      "GS is heavily UP-focused and Hindi is grammar-heavy; recent papers put UP GK near 30%.",
    mockPlan: "20 prelims full tests, 15 mains tests and 10 Hindi typing practice sets.",
    dailyPlan: "10 GS + 10 Hindi grammar questions and one weekly essay topic.",
  },
  {
    id: "TET_COMBO_CTET_UPTET",
    exam: "CTET / UPTET",
    title: "TET Combo",
    tier: "Standard",
    subjectsCount: 7,
    pyqQuestions: "5000+",
    mocks: 90,
    dailyQuizzes: 365,
    pattern: "Paper I and Paper II tracks with no negative marking.",
    subjects: [
      "Child Development & Pedagogy",
      "Language I - Hindi",
      "Language II - English / Urdu / Sanskrit",
      "Mathematics",
      "Environmental Studies",
      "Science / Social Studies",
      "UP Education & Govt Schemes",
    ],
    syllabus: [
      "CDP: Piaget, Kohlberg, Vygotsky, inclusive education and learning theories",
      "Maths: numbers, LCM/HCF, fractions, algebra, geometry, mensuration and pedagogy",
      "EVS: family, food, shelter, water, travel, things we make and pedagogy",
      "Languages: comprehension, grammar and language-development pedagogy",
    ],
    pyqInsight:
      "CDP stays conceptual, EVS follows NCERT, and Maths includes around 10 pedagogy questions.",
    mockPlan: "20 Paper I mocks, 20 Paper II mocks and 50 subject-wise mini mocks.",
    dailyPlan: "10 CDP + 10 Maths + 10 EVS + 5 language questions on rotation.",
  },
  {
    id: "PET_FOUNDATION",
    exam: "UPSSSC PET",
    title: "PET Foundation",
    tier: "Foundation",
    subjectsCount: 15,
    pyqQuestions: "300+",
    mocks: 60,
    dailyQuizzes: 365,
    pattern: "100 questions across 15 subjects with passage, graph and table sections.",
    subjects: [
      "Indian History",
      "National Movement",
      "Geography",
      "Economy",
      "Polity",
      "Science",
      "Arithmetic",
      "Hindi",
      "English",
      "Reasoning",
      "Current Affairs",
      "General Awareness",
      "Hindi Comprehension",
      "Graph Interpretation",
      "Table Analysis",
    ],
    syllabus: [
      "History from IVC to modern reform movements",
      "Geography, economy, constitution, science and arithmetic fundamentals",
      "Hindi/English grammar, reasoning, current affairs and UP GK",
      "Hindi passages, graph interpretation and table-analysis scoring sections",
    ],
    pyqInsight:
      "Graph/table and passage sections are scoring; General cutoff often sits around 65-70.",
    mockPlan: "30 full PET mocks, 20 sectional tests and 10 previous-year papers.",
    dailyPlan: "5 arithmetic + 5 reasoning + 10 current affairs + 5 Hindi/English.",
  },
  {
    id: "LEKHPAL_MAINS_2025",
    exam: "UP Lekhpal",
    title: "Lekhpal Mains 2025",
    tier: "Specialist",
    subjectsCount: 12,
    pyqQuestions: "1000+",
    mocks: 50,
    dailyQuizzes: 365,
    pattern: "New 100-question mains pattern after PET shortlist.",
    subjects: [
      "General Hindi",
      "Data Interpretation",
      "History & National Movement",
      "Polity",
      "Geography",
      "Economy & Social Development",
      "Rural Society",
      "Current Affairs",
      "Science & Tech",
      "Environment & Disaster",
      "Computer & IT",
      "Uttar Pradesh GK",
    ],
    syllabus: [
      "Hindi grammar, comprehension, maths and data from tables/graphs",
      "Rural administration, revenue system, land reforms and Panchayati Raj",
      "Computer fundamentals, MS Office, internet, networking and cyber security",
      "UP revenue, land measurement, districts, rivers, schemes and budget",
    ],
    pyqInsight:
      "Old Lekhpal papers are partly outdated; new pattern is expected to be Rural + UP GK heavy.",
    mockPlan: "25 full mains mocks, 15 UP GK mocks, 10 rural/revenue mocks and 10 computer tests.",
    dailyPlan: "5 UP GK + 5 rural/revenue + 5 maths DI + 5 computer questions.",
  },
  {
    id: "UPPOLICE_COMBO",
    exam: "UP Police",
    title: "UP Police Combo",
    tier: "Popular",
    subjectsCount: 5,
    pyqQuestions: "2500+",
    mocks: 70,
    dailyQuizzes: 365,
    pattern: "Constable and SI tracks with GK, Hindi, Maths, Reasoning, Law and Computer.",
    subjects: [
      "General Knowledge",
      "General Hindi",
      "Numerical & Mental Ability",
      "Mental Aptitude / IQ / Reasoning",
      "Computer Knowledge and Basic Law",
    ],
    syllabus: [
      "India and UP GK, history, polity, economy, geography, science and current affairs",
      "SI law module: IPC, CrPC, Constitution, human rights and traffic rules",
      "Hindi grammar, comprehension, numerical ability and data interpretation",
      "Verbal/non-verbal reasoning, law and order, gender sensitivity and public interest",
    ],
    pyqInsight:
      "UP GK is consistently important; SI candidates need Basic Law as a scoring module.",
    mockPlan: "40 constable full mocks, 30 SI full mocks and 40 sectional mocks.",
    dailyPlan: "Constable: GK/Hindi/Maths/Reasoning. SI adds 10 daily law questions.",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "cat_cdp",
    slug: "cdp",
    name: "Child Development & Pedagogy",
    description: "Learning theories, inclusive education and pedagogy fundamentals.",
  },
  {
    id: "cat_hindi",
    slug: "hindi",
    name: "Hindi",
    description: "Grammar, comprehension and pedagogy-oriented Hindi practice.",
  },
  {
    id: "cat_english",
    slug: "english",
    name: "English",
    description: "Language skills, comprehension and teaching methodology.",
  },
  {
    id: "cat_maths",
    slug: "maths",
    name: "Mathematics",
    description: "Core maths concepts with speed-focused practice.",
  },
  {
    id: "cat_evs",
    slug: "evs-science",
    name: "EVS / Science",
    description: "Environment, science basics and classroom application.",
  },
  {
    id: "cat_social",
    slug: "social-studies",
    name: "Social Studies",
    description: "History, geography, civics and social pedagogy.",
  },
];

export type SeedTest = Omit<TestSummary, "isUnlocked" | "questionCount"> & {
  questions: Question[];
};

export const SEED_TESTS: SeedTest[] = [
  {
    id: "test_starter_mock_1",
    slug: "tet-starter-mock-1",
    title: "Starter Full Mock 1",
    description: "A balanced starter mock across major TET sections.",
    categorySlug: "cdp",
    categoryName: "Child Development & Pedagogy",
    packageSlug: "starter",
    durationMinutes: 25,
    totalMarks: 5,
    questions: [
      {
        id: "q_starter_1",
        testId: "test_starter_mock_1",
        prompt: "Which principle best supports child-centred education?",
        options: [
          "Memorisation first",
          "Learning by doing",
          "Punishment for errors",
          "One-way lecture",
        ],
        correctAnswer: "Learning by doing",
        explanation:
          "Child-centred education values active participation, exploration and learning by doing.",
        marks: 1,
      },
      {
        id: "q_starter_2",
        testId: "test_starter_mock_1",
        prompt: "A formative assessment is mainly used to:",
        options: [
          "Rank students only",
          "Improve learning during instruction",
          "Replace all exams",
          "Select teachers",
        ],
        correctAnswer: "Improve learning during instruction",
        explanation:
          "Formative assessment gives feedback during the learning process so teaching can be adjusted.",
        marks: 1,
      },
      {
        id: "q_starter_3",
        testId: "test_starter_mock_1",
        prompt: "Which is a prime number?",
        options: ["1", "2", "4", "9"],
        correctAnswer: "2",
        explanation:
          "Two is the smallest prime number because it has exactly two factors: 1 and itself.",
        marks: 1,
      },
    ],
  },
  {
    id: "test_cdp_practice",
    slug: "ctet-cdp-practice",
    title: "CTET CDP Practice Set",
    description: "Child development and pedagogy questions with detailed explanations.",
    categorySlug: "cdp",
    categoryName: "Child Development & Pedagogy",
    packageSlug: "complete",
    durationMinutes: 20,
    totalMarks: 5,
    questions: [
      {
        id: "q_cdp_1",
        testId: "test_cdp_practice",
        prompt: "Inclusive education means:",
        options: [
          "Teaching only high scorers",
          "Separating children by ability",
          "Welcoming diverse learners in one classroom",
          "Avoiding assessment",
        ],
        correctAnswer: "Welcoming diverse learners in one classroom",
        explanation:
          "Inclusive classrooms adapt support so learners with different needs can participate together.",
        marks: 1,
      },
      {
        id: "q_cdp_2",
        testId: "test_cdp_practice",
        prompt: "The zone of proximal development was proposed by:",
        options: ["Piaget", "Vygotsky", "Skinner", "Thorndike"],
        correctAnswer: "Vygotsky",
        explanation:
          "Vygotsky described the gap between what a learner can do alone and with guidance as ZPD.",
        marks: 1,
      },
    ],
  },
  {
    id: "test_maths_speed",
    slug: "uptet-maths-speed",
    title: "UPTET Maths Speed Drill",
    description: "Timed maths practice for accuracy and speed.",
    categorySlug: "maths",
    categoryName: "Mathematics",
    packageSlug: "premium",
    durationMinutes: 15,
    totalMarks: 5,
    questions: [
      {
        id: "q_maths_1",
        testId: "test_maths_speed",
        prompt: "What is 25% of 240?",
        options: ["40", "50", "60", "80"],
        correctAnswer: "60",
        explanation: "25% is one-fourth, and one-fourth of 240 is 60.",
        marks: 1,
      },
      {
        id: "q_maths_2",
        testId: "test_maths_speed",
        prompt: "The next number in 3, 6, 12, 24 is:",
        options: ["30", "36", "42", "48"],
        correctAnswer: "48",
        explanation: "Each term is doubled, so 24 doubled is 48.",
        marks: 1,
      },
    ],
  },
  {
    id: "test_evs_pyq",
    slug: "evs-pyq-revision",
    title: "EVS PYQ Revision",
    description: "Previous-year style EVS questions with solution review.",
    categorySlug: "evs-science",
    categoryName: "EVS / Science",
    packageSlug: "premium",
    durationMinutes: 15,
    totalMarks: 5,
    questions: [
      {
        id: "q_evs_1",
        testId: "test_evs_pyq",
        prompt: "Which gas do plants mainly absorb for photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correctAnswer: "Carbon dioxide",
        explanation: "Plants use carbon dioxide and water to prepare food during photosynthesis.",
        marks: 1,
      },
      {
        id: "q_evs_2",
        testId: "test_evs_pyq",
        prompt: "A good EVS classroom should encourage:",
        options: [
          "Only textbook copying",
          "Observation and questioning",
          "Silent memorisation",
          "No field activity",
        ],
        correctAnswer: "Observation and questioning",
        explanation:
          "EVS learning becomes meaningful when children observe, ask questions and connect concepts to life.",
        marks: 1,
      },
    ],
  },
];

export function getPlan(slug: string): PackagePlan | undefined {
  return PACKAGE_PLANS.find((plan) => plan.slug === slug);
}

export function planRank(slug: PlanSlug): number {
  return PACKAGE_PLANS.findIndex((plan) => plan.slug === slug);
}
