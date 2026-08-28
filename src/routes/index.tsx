import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCheck,
  BookOpenCheck,
  Layers,
  CalendarDays,
  Newspaper,
  History,
  Timer,
  BarChart3,
  XCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
  TrendingUp,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

import heroIllustration from "@/assets/hero-illustration.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TET Quiz Package — UPTET & CTET Mock Tests | UPQuizBazaar" },
      {
        name: "description",
        content:
          "Complete UPTET/CTET quiz package: 30 full mock tests, subject & chapter-wise tests, PYQs with explanations, exam timer, performance analysis and leaderboard. Plans from ₹29.",
      },
      {
        property: "og:title",
        content: "TET Quiz Package — UPTET & CTET Mock Tests | UPQuizBazaar",
      },
      {
        property: "og:description",
        content:
          "30 full mock tests, 5,000+ questions, PYQs with explanations, exam-like timer, performance analysis and leaderboard. Plans from ₹29.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PackagePage,
});

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Full Mock Tests",
    desc: "20–30 full-length tests built to the real UPTET/CTET pattern.",
  },
  {
    icon: BookOpenCheck,
    title: "Subject Tests",
    desc: "CDP, Hindi, English, Maths, EVS/Science & Social Studies.",
  },
  {
    icon: Layers,
    title: "Chapter-wise Tests",
    desc: "5–10 quizzes per important chapter for deep coverage.",
  },
  {
    icon: CalendarDays,
    title: "Daily Quiz",
    desc: "20–30 fresh questions every day to stay in practice.",
  },
  {
    icon: Newspaper,
    title: "Current Affairs",
    desc: "Monthly, exam-oriented current affairs capsules.",
  },
  {
    icon: History,
    title: "Previous Year Questions",
    desc: "UPTET/CTET PYQs with detailed explanations.",
  },
  {
    icon: Timer,
    title: "Exam Timer",
    desc: "Real exam-like countdown on every test.",
  },
  {
    icon: BarChart3,
    title: "Result Analysis",
    desc: "Score, percentage, accuracy and time per question.",
  },
  {
    icon: XCircle,
    title: "Wrong Questions",
    desc: "Automatic wrong-answer practice sets.",
  },
  {
    icon: RotateCcw,
    title: "Re-attempt",
    desc: "Retake failed or wrong questions anytime.",
  },
  {
    icon: Lightbulb,
    title: "Solutions",
    desc: "Step-by-step explanation for every question.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    desc: "See your rank among other aspirants.",
  },
];

type Tier = {
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
    name: "Premium",
    price: "99",
    tagline: "The complete TET preparation package.",
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

const COMPARE_ROWS: { label: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { label: "Full Mock Tests", values: ["5", "15", "30"] },
  { label: "Subject / Chapter Tests", values: ["10", "40", "100+"] },
  { label: "Total Questions", values: ["500+", "2,000+", "5,000+"] },
  { label: "Previous Year Questions", values: [false, true, true] },
  { label: "Detailed Explanations", values: ["Basic", true, true] },
  { label: "Performance Analysis", values: [false, true, true] },
  { label: "Daily Quizzes", values: [false, false, true] },
  { label: "Wrong-Question Practice", values: [false, true, true] },
  { label: "Unlimited Re-attempts", values: [false, false, true] },
  { label: "Leaderboard & Rank", values: [false, false, true] },
];

const FAQS = [
  {
    q: "Which exams does this package cover?",
    a: "The package is built for UPTET and CTET aspirants. Mock tests follow the latest paper pattern, and subject tests cover CDP, Hindi, English, Maths, EVS/Science and Social Studies.",
  },
  {
    q: "How is the ₹99 Premium different from ₹49?",
    a: "Premium doubles the mock tests to 30, adds 5,000+ questions, daily quizzes, the leaderboard, wrong-question practice and unlimited re-attempts — essentially the full exam hall experience. ₹49 Complete is the value pick; ₹99 is the complete preparation package.",
  },
  {
    q: "Do I get explanations for every question?",
    a: "Yes. Every question across all three plans includes a step-by-step solution so you understand the concept, not just the answer.",
  },
  {
    q: "Can I retake tests I failed?",
    a: "Complete and Premium plans include automatic wrong-question practice and re-attempts. Premium adds unlimited re-attempts for revision.",
  },
  {
    q: "Is there an exam-like timer?",
    a: "Every test runs with a real exam countdown, and the result analysis shows your time per question and accuracy.",
  },
];

function PackagePage() {
  return (
    <div className="min-h-screen bg-cream bg-grain text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Comparison />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Trophy className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">
            UP<span className="text-primary">Quiz</span>Bazaar
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-ink">What's included</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          <a href="#compare" className="transition-colors hover:text-ink">Compare</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </nav>
        <a
          href="#pricing"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="size-4 text-primary" />
          View Plans
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-saffron-glow">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            UPTET · CTET 2026 Batch
          </span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-5xl">
            Crack the{" "}
            <span className="text-gradient-saffron">TET exam</span> with one
            complete quiz package.
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
            Full mock tests, subject & chapter-wise quizzes, PYQs with
            explanations, an exam-like timer, performance analysis and a
            leaderboard — all in one place.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
            >
              Choose your plan
              <ChevronDown className="size-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
            >
              See what's included
            </a>
          </div>

          <dl className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {[
              ["30", "Full Mocks"],
              ["5,000+", "Questions"],
              ["100+", "Quizzes"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="rounded-2xl border border-border bg-card px-3 py-3 text-center shadow-card"
              >
                <dt className="text-2xl font-extrabold text-ink">{n}</dt>
                <dd className="text-xs font-medium text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/15 blur-2xl" />
          <img
            src={heroIllustration}
            alt="Illustration of an aspirant preparing for the TET exam with books, a quiz phone and a trophy"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-md rounded-[2rem] border border-border/60 bg-card object-cover shadow-card animate-float-slow"
          />
          <span className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink shadow-card">
            <Star className="size-3.5 fill-primary text-primary" />
            Trusted by 50,000+ aspirants
          </span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Everything in one package"
        title="What's included"
        subtitle="Twelve tools that take you from first attempt to exam-day confidence."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-bold text-ink">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-y border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <SectionHeading
          eyebrow="Three plans, one goal"
          title="Pick your TET package"
          subtitle="Start at ₹29 or go all-in with the complete ₹99 preparation package."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
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

function TierCard({ tier }: { tier: Tier }) {
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
        <h3 className={premium ? "text-lg font-extrabold text-cream" : "text-lg font-extrabold text-ink"}>
          {tier.name}
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
        {tier.tagline}
      </p>

      <div className="mt-5 flex items-end gap-1">
        <span className={premium ? "text-2xl font-bold text-cream/80" : "text-2xl font-bold text-muted-foreground"}>
          ₹
        </span>
        <span className={premium ? "text-5xl font-extrabold text-cream" : "text-5xl font-extrabold text-ink"}>
          {tier.price}
        </span>
        <span className={premium ? "mb-1 text-sm text-cream/60" : "mb-1 text-sm text-muted-foreground"}>
          one-time
        </span>
      </div>

      <a
        href="#"
        className={
          premium
            ? "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
            : "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
        }
      >
        {tier.cta}
      </a>

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

function Comparison() {
  return (
    <section id="compare" className="mx-auto max-w-5xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Side by side"
        title="Compare the plans"
        subtitle="A clear look at exactly what each package gives you."
      />
      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/60">
                <th className="px-4 py-4 text-left font-semibold text-ink">Feature</th>
                {TIERS.map((t) => (
                  <th
                    key={t.name}
                    className={
                      t.highlight
                        ? "bg-primary/10 px-4 py-4 text-center font-extrabold text-primary"
                        : "px-4 py-4 text-center font-bold text-ink"
                    }
                  >
                    {t.name}
                    <div className={t.highlight ? "text-[11px] font-medium text-primary/70" : "text-[11px] font-medium text-muted-foreground"}>
                      ₹{t.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 ? "bg-secondary/30" : "bg-card"}>
                  <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                  {TIERS.map((tier, idx) => (
                    <td
                      key={tier.name}
                      className={
                        tier.highlight
                          ? "bg-primary/[0.06] px-4 py-3 text-center"
                          : "px-4 py-3 text-center"
                      }
                    >
                      <CompareCell value={row.values[idx]} highlight={tier.highlight ?? false} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CompareCell({ value, highlight }: { value: boolean | string | undefined; highlight?: boolean }) {
  if (value === true) {
    return <Check className={highlight ? "mx-auto size-4 text-primary" : "mx-auto size-4 text-jade"} />;
  }
  if (value === false) {
    return <XCircle className="mx-auto size-4 text-muted-foreground/50" />;
  }
  return (
    <span className={highlight ? "font-bold text-primary" : "font-semibold text-ink"}>
      {value}
    </span>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <SectionHeading
          eyebrow="Good to know"
          title="Frequently asked questions"
          subtitle=""
        />
        <div className="mt-8 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-ink">{item.q}</span>
                  <ChevronDown
                    className={
                      "size-4 shrink-0 text-muted-foreground transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="card-premium relative overflow-hidden rounded-[2rem] px-6 py-12 text-center shadow-premium md:px-12">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" />
        <TrendingUp className="mx-auto size-8 text-primary" />
        <h2 className="mt-4 text-balance text-3xl font-extrabold text-cream md:text-4xl">
          Ready to start your TET prep?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-cream/70">
          Join 50,000+ aspirants and pick the complete ₹99 preparation package —
          mocks, PYQs, daily quizzes, leaderboard and unlimited re-attempts.
        </p>
        <a
          href="#pricing"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          Get the Premium Package
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
        <p>© 2026 UPQuizBazaar. Made for UPTET & CTET aspirants.</p>
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
      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
