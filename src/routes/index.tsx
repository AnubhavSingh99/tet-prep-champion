import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Newspaper,
  Trophy,
  TrendingUp,
  Check,
  ShieldCheck,
  Sparkles,
  Menu,
  Moon,
  Languages,
  Flame,
  Megaphone,
  Gift,
  Copy,
  Share2,
  PenLine,
  Calculator,
  Globe2,
  Brain,
  Landmark,
  Laptop,
  Star,
} from "lucide-react";
import { useState } from "react";

import { EXAM_PACKAGE_OPTIONS, UP_EXAM_BUNDLES } from "@/lib/platform-model";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UP Exams Quiz Platform | UPQuizBazaar" },
      {
        name: "description",
        content:
          "AI-ready quiz platform for UP PCS, RO/ARO, UPTET/CTET, PET, Lekhpal and UP Police with subject-wise syllabus, PYQs, mocks and daily quizzes.",
      },
      {
        property: "og:title",
        content: "UP Exams Quiz Platform | UPQuizBazaar",
      },
      {
        property: "og:description",
        content:
          "Six UP exam bundles with subject-wise syllabus, PYQ banks, mock blueprints, daily quizzes and performance tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PackagePage,
});

type Tier = {
  slug: "starter" | "complete" | "premium";
  name: string;
  price: string;
  tagline: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

const TIERS: Tier[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "29",
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
    slug: "complete",
    name: "Complete",
    price: "49",
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
    slug: "premium",
    name: "Premium",
    price: "99",
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

const IMPORTANT_MESSAGES = [
  "Free Daily CA at 8AM - Don't Miss!",
  "Refer Friends & Earn ₹30",
  "All Prices Inclusive - No Extra Charges",
  "MONSOON50 - 50% OFF Live Now!",
];

const SUBJECT_PRACTICE = [
  {
    title: "Hindi",
    questions: "1500 Qs",
    badge: "Popular",
    icon: PenLine,
    gradient: "from-orange-500 to-rose-500",
  },
  {
    title: "Maths",
    questions: "1800 Qs",
    badge: "New",
    icon: Calculator,
    gradient: "from-sky-500 to-indigo-600",
  },
  {
    title: "GK/GS",
    questions: "2000 Qs",
    badge: "Bestseller",
    icon: Globe2,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Reasoning",
    questions: "1200 Qs",
    badge: "Popular",
    icon: Brain,
    gradient: "from-fuchsia-500 to-violet-600",
  },
  {
    title: "Current Affairs",
    questions: "800 Qs",
    badge: "New",
    icon: Newspaper,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "UP Special",
    questions: "1000 Qs",
    badge: "UP Special",
    icon: Landmark,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    title: "English",
    questions: "900 Qs",
    badge: "Popular",
    icon: Languages,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Computer",
    questions: "700 Qs",
    badge: "New",
    icon: Laptop,
    gradient: "from-slate-700 to-slate-950",
  },
];

const EXAM_CARD_STYLES = [
  {
    gradient: "from-orange-500 to-rose-500",
    badge: "Bestseller",
    rating: "4.9",
    accent: "bg-orange-500",
  },
  {
    gradient: "from-sky-500 to-indigo-600",
    badge: "Popular",
    rating: "4.8",
    accent: "bg-sky-500",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    badge: "Teacher Pick",
    rating: "4.9",
    accent: "bg-emerald-500",
  },
  {
    gradient: "from-amber-400 to-orange-500",
    badge: "Foundation",
    rating: "4.7",
    accent: "bg-amber-400",
  },
  {
    gradient: "from-fuchsia-500 to-violet-600",
    badge: "UP Special",
    rating: "4.8",
    accent: "bg-fuchsia-500",
  },
  {
    gradient: "from-cyan-500 to-blue-600",
    badge: "New",
    rating: "4.8",
    accent: "bg-cyan-500",
  },
];

function PackagePage() {
  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_95)] text-foreground">
      <RunningOfferBars />
      <SiteHeader />
      <main>
        <Hero />
        <StatsStrip />
        <ReferralCard />
        <ExamBundles />
        <SubjectPractice />
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-blue-600 text-lg font-black text-white shadow-sm">
            UP
          </span>
          <span className="text-lg font-black tracking-tight text-ink sm:text-2xl">
            UP QUIZ BAZAAR
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#bundles" className="transition-colors hover:text-ink">
            Exams
          </a>
          <a href="#pricing" className="transition-colors hover:text-ink">
            Pricing
          </a>
          <Link to="/tests" className="transition-colors hover:text-ink">
            Tests
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-sm lg:inline-flex"
          >
            Dashboard
          </Link>
          <button className="inline-flex h-11 items-center gap-1 rounded-full border border-border bg-card px-3 text-sm font-black text-ink shadow-sm">
            <Languages className="size-4" />
            EN
          </button>
          <button
            aria-label="Toggle theme"
            className="grid size-11 place-items-center rounded-full border border-border bg-card text-ink shadow-sm"
          >
            <Moon className="size-5" />
          </button>
          <Link
            to="/auth"
            className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <Sparkles className="size-4 text-primary" />
            Sign in
          </Link>
          <button
            aria-label="Open menu"
            className="grid size-11 place-items-center rounded-full bg-black text-white shadow-sm"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function RunningOfferBars() {
  const tickerText =
    "MONSOON50 live now  •  Free Daily CA at 8AM  •  Prices include taxes  •  Refer & earn ₹30  •";

  return (
    <div className="relative z-50 overflow-hidden border-b border-black/5 bg-white">
      <div className="overflow-hidden bg-black py-2 text-sm font-semibold text-white">
        <div className="animate-marquee flex w-max min-w-full gap-8 whitespace-nowrap">
          <span>{tickerText}</span>
          <span aria-hidden="true">{tickerText}</span>
          <span aria-hidden="true">{tickerText}</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-100 via-emerald-50 to-sky-100 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-sm">
          <span className="rounded-full bg-black px-3 py-1.5 font-black uppercase text-white">
            Free Daily
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-black text-black sm:text-base">
              Current Affairs Quiz at 8AM
            </p>
          </div>
          <Link
            to="/tests"
            className="shrink-0 rounded-full bg-black px-4 py-2 text-sm font-black text-white shadow-sm"
          >
            Attempt Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="px-4 py-8 sm:px-5 md:py-12">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-card sm:p-8 md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
            <Flame className="size-4" />
            5000+ questions across 6 UP exams
          </span>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl md:text-6xl">
            Pick your exam. Practice the right questions.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-muted-foreground">
            Minimal prep workspace for UP PCS, RO/ARO, UPTET/CTET, PET, Lekhpal and UP Police with
            exam-wise packages, mocks, PYQs and subject practice.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-black text-white shadow-card transition-transform hover:-translate-y-0.5"
            >
              Choose Package
              <Sparkles className="size-4 text-amber-300" />
            </a>
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-3.5 text-sm font-black text-ink shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Try Free Quiz
            </Link>
          </div>
        </div>

        <MovingUpdatesPanel />
      </div>
    </section>
  );
}

function MovingUpdatesPanel() {
  const movingMessages = [...IMPORTANT_MESSAGES, ...IMPORTANT_MESSAGES];

  return (
    <aside className="flex h-full flex-col rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-card sm:p-8 md:p-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink">
          <Megaphone className="size-5 text-orange-500" />
          Updates
        </h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
          Live
        </span>
      </div>

      <div className="mt-5 min-h-[300px] flex-1 overflow-hidden rounded-[22px] border border-black/5 bg-[oklch(0.985_0.008_95)] p-3">
        <div className="animate-marquee-vertical grid gap-3">
          {movingMessages.map((message, index) => (
            <div
              key={`${message}-${index}`}
              className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-black text-ink shadow-sm"
            >
              <span className="mr-2 text-primary">•</span>
              {message}
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/tests/free-daily-current-affairs"
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white"
      >
        Start Free Daily Quiz
      </Link>
    </aside>
  );
}

function StatsStrip() {
  return (
    <section className="px-4 pb-8 sm:px-5">
      <dl className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
        {[
          ["6", "Exams", "bg-pink-500"],
          ["52", "Subjects", "bg-emerald-500"],
          ["3200", "Uploaded Qs", "bg-amber-400"],
        ].map(([n, l, color]) => (
          <div key={l} className={`${color} rounded-2xl p-4 text-black shadow-card sm:p-5`}>
            <dt className="text-2xl font-black sm:text-3xl">{n}</dt>
            <dd className="mt-1 text-[11px] font-black uppercase sm:text-xs">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReferralCard() {
  return (
    <section className="px-4 py-6 sm:px-5">
      <div className="mx-auto grid max-w-6xl gap-4 rounded-[1.75rem] bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black sm:text-3xl">
            <Gift className="size-8 text-amber-200" />
            Refer Friends - Earn ₹30
          </h2>
          <p className="mt-2 text-base font-semibold text-white/85">
            Friend gets ₹50 OFF with code UP50FRIEND
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-4 rounded-2xl bg-white px-6 py-4 text-2xl font-black text-black shadow-sm">
            UP50FRIEND
            <span className="grid size-12 place-items-center rounded-xl bg-black text-white">
              <Copy className="size-7" />
            </span>
          </button>
          <a
            href="https://wa.me/?text=Use%20code%20UP50FRIEND%20for%20UP%20Quiz%20Bazaar"
            className="inline-flex items-center gap-3 rounded-full bg-black px-8 py-5 text-2xl font-black text-white shadow-sm"
          >
            <Share2 className="size-7" />
            WhatsApp Share
          </a>
        </div>
      </div>
    </section>
  );
}

function SubjectPractice() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Practice packs</p>
          <h2 className="mt-2 text-balance text-3xl font-black leading-tight text-ink md:text-4xl">
            Subject Wise Practice - 8 Subjects
          </h2>
        </div>
        <span className="w-fit rounded-full border border-black/5 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm">
          Free samples • Full packs
        </span>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUBJECT_PRACTICE.map(({ title, questions, badge, icon: Icon, gradient }) => (
          <article
            key={title}
            className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-card"
          >
            <div className={`min-h-32 bg-gradient-to-br ${gradient} p-4 text-white`}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/20">
                  <Icon className="size-6" />
                </span>
                <span className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-black uppercase text-white ring-1 ring-white/15">
                  {badge}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-black leading-tight text-white">
                {title} • {questions}
              </h3>
            </div>
            <div className="space-y-3 p-4 text-center">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/tests"
                  className="flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-sm font-black text-ink shadow-sm"
                >
                  Free 10 Qs
                </Link>
                <Link
                  to="/checkout/$plan"
                  params={{ plan: "complete" }}
                  search={{ exam: "UPTET_CTET" }}
                  className="flex min-h-12 items-center justify-center rounded-full bg-black px-3 text-sm font-black leading-tight text-white shadow-sm"
                >
                  ₹49 Full
                </Link>
              </div>
              <p className="text-xs font-bold text-muted-foreground">Inclusive of taxes</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExamBundles() {
  return (
    <section id="bundles" className="mx-auto max-w-6xl px-5 py-14 md:py-16">
      <SectionHeading
        eyebrow="Master course packages"
        title="Choose the exam first"
        subtitle="Each exam keeps its own subjects, mocks, PYQs and daily quiz plan."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {UP_EXAM_BUNDLES.map((bundle, index) => {
          const style = EXAM_CARD_STYLES[index % EXAM_CARD_STYLES.length];
          return (
            <article
              key={bundle.id}
              className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-card"
            >
              <div className={`bg-gradient-to-br ${style.gradient} p-5 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/70">
                      {bundle.id}
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                      {bundle.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-black uppercase ring-1 ring-white/15">
                    {style.badge}
                  </span>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1.5 text-xs font-black">
                  <Star className="size-3.5 fill-amber-300 text-amber-300" />
                  {style.rating} rating • {bundle.tier}
                </div>
              </div>

              <dl className="grid grid-cols-4 gap-px bg-black/5 text-center">
                {[
                  [bundle.subjectsCount, "Subjects"],
                  [bundle.pyqQuestions, "PYQs"],
                  [bundle.mocks, "Mocks"],
                  [bundle.dailyQuizzes, "Daily"],
                ].map(([value, label]) => (
                  <div key={label} className="bg-white px-2 py-3">
                    <dt className="text-base font-black text-ink">{value}</dt>
                    <dd className="text-[10px] font-black uppercase text-muted-foreground">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="p-5">
                <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                  {bundle.pattern}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bundle.subjects.slice(0, 4).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-black text-ink"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <Link
                  to="/tests"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white"
                >
                  View Tests
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Pricing() {
  const [selectedExam, setSelectedExam] = useState(EXAM_PACKAGE_OPTIONS[2]);

  return (
    <section id="pricing" className="border-y border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <SectionHeading
          eyebrow="Exam-wise access plans"
          title={`Pick a package for ${selectedExam.name}`}
          subtitle="Each exam has its own Starter, Complete and Premium package. Buying one exam package unlocks that exam only."
        />
        <div className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-2">
          {EXAM_PACKAGE_OPTIONS.map((exam) => (
            <button
              key={exam.code}
              onClick={() => setSelectedExam(exam)}
              className={
                "rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-colors " +
                (selectedExam.code === exam.code
                  ? "border-ink bg-ink text-cream"
                  : "border-border bg-card text-ink hover:border-primary/50")
              }
            >
              {exam.name}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.name}
              tier={tier}
              examCode={selectedExam.code}
              examName={selectedExam.name}
            />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-3.5 text-jade" />
          Instant access · Secure payment · Valid till exam day
        </p>
      </div>
    </section>
  );
}

function TierCard({
  tier,
  examCode,
  examName,
}: {
  tier: Tier;
  examCode: string;
  examName: string;
}) {
  const premium = tier.highlight;
  return (
    <div
      className={
        premium
          ? "card-premium relative overflow-hidden rounded-3xl p-6 shadow-premium lg:-mt-4 lg:mb-0"
          : "relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card"
      }
    >
      {premium && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
          <span className="animate-shimmer-line block h-px w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3
          className={
            premium ? "text-lg font-extrabold text-cream" : "text-lg font-extrabold text-ink"
          }
        >
          {examName} {tier.name}
        </h3>
        {tier.badge && (
          <span
            className={
              premium
                ? "rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground"
                : "rounded-full border border-jade/30 bg-jade/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-jade"
            }
          >
            {tier.badge}
          </span>
        )}
      </div>
      <p className={premium ? "mt-1 text-sm text-cream/70" : "mt-1 text-sm text-muted-foreground"}>
        {tier.tagline} Unlocks {examName} only.
      </p>

      <div className="mt-5 flex items-end gap-1">
        <span
          className={
            premium
              ? "text-2xl font-bold text-cream/80"
              : "text-2xl font-bold text-muted-foreground"
          }
        >
          ₹
        </span>
        <span
          className={
            premium ? "text-5xl font-extrabold text-cream" : "text-5xl font-extrabold text-ink"
          }
        >
          {tier.price}
        </span>
        <span
          className={premium ? "mb-1 text-sm text-cream/60" : "mb-1 text-sm text-muted-foreground"}
        >
          one-time
        </span>
      </div>

      <Link
        to="/checkout/$plan"
        params={{ plan: tier.slug }}
        search={{ exam: examCode }}
        className={
          premium
            ? "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
            : "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
        }
      >
        {tier.cta}
      </Link>

      <ul className="mt-6 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <span
              className={
                premium
                  ? "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary"
                  : "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-jade/15 text-jade"
              }
            >
              <Check className="size-3.5" />
            </span>
            <span className={premium ? "text-cream/85" : "text-foreground"}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="card-premium relative overflow-hidden rounded-[2rem] px-6 py-12 text-center shadow-premium md:px-12">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" />
        <TrendingUp className="mx-auto size-8 text-primary" />
        <h2 className="mt-4 text-balance text-3xl font-extrabold text-cream md:text-4xl">
          Ready to start your UP exam prep?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-cream/70">
          Join learners preparing for UP PCS, RO/ARO, TET, PET, Lekhpal and UP Police with one
          syllabus-led quiz workspace.
        </p>
        <a
          href="#pricing"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          Choose Exam Package
          <Sparkles className="size-4" />
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="size-4" />
          </span>
          <span className="font-bold text-ink">
            UP<span className="text-primary">Quiz</span>Bazaar
          </span>
        </div>
        <p>© 2026 UPQuizBazaar. Made for Uttar Pradesh exam aspirants.</p>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</span>
      <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
