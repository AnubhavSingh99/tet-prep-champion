import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpenCheck,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

import { LoadingState, UnavailableState } from "./states";
import { clearDemoSession, useAuthSession } from "@/hooks/use-auth-session";

const learnerNav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/tests", label: "Tests", icon: BookOpenCheck },
  { to: "/wrong-questions", label: "Wrong Review", icon: XCircle },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/purchases", label: "Purchases", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
];

export function LearnerShell({ children }: { children: ReactNode }) {
  return <PlatformShell nav={learnerNav}>{children}</PlatformShell>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const session = useAuthSession();
  if (session.status === "loading") {
    return (
      <ShellFrame>
        <LoadingState label="Checking admin session" />
      </ShellFrame>
    );
  }

  if (session.status === "unauthenticated") {
    return <AuthRedirect />;
  }

  return (
    <PlatformShell nav={[{ to: "/admin", label: "Admin", icon: Settings }, ...learnerNav]}>
      {children}
    </PlatformShell>
  );
}

function PlatformShell({
  children,
  nav,
}: {
  children: ReactNode;
  nav: { to: string; label: string; icon: typeof Home }[];
}) {
  const session = useAuthSession();
  async function handleSignOut() {
    clearDemoSession();
    await supabase.auth.signOut();
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        window.localStorage.removeItem(key);
      }
    }
    window.location.replace("/auth");
  }

  if (session.status === "loading") {
    return (
      <ShellFrame>
        <LoadingState label="Checking your session" />
      </ShellFrame>
    );
  }

  if (session.status === "unauthenticated") {
    return <AuthRedirect />;
  }

  return (
    <ShellFrame>
      {session.status === "unavailable" && <UnavailableState />}
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[230px_1fr]">
        <aside className="rounded-[28px] border border-black/5 bg-white p-3 shadow-card">
          <Link to="/" className="mb-3 flex items-center gap-2 rounded-2xl px-2 py-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 text-sm font-black text-white">
              UP
            </span>
            <span className="font-extrabold text-ink">
              UP<span className="text-primary">Quiz</span>Bazaar
            </span>
          </Link>
          <nav className="space-y-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavItem key={to} to={to} label={label} icon={Icon} />
            ))}
          </nav>
          <button
            onClick={() => void handleSignOut()}
            className="mt-4 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-orange-50 hover:text-ink"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </aside>
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between rounded-[24px] border border-black/5 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                Learner Panel
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                Exam-wise practice workspace
              </p>
            </div>
            <button
              aria-label="Open navigation"
              className="grid size-11 place-items-center rounded-full bg-black text-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
          {children}
        </section>
      </div>
    </ShellFrame>
  );
}

function AuthRedirect() {
  if (typeof window !== "undefined") {
    const redirect = window.location.pathname === "/auth" ? "/dashboard" : window.location.pathname;
    window.location.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
  }
  return (
    <ShellFrame>
      <LoadingState label="Opening sign in" />
    </ShellFrame>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f7f2] px-4 py-5 text-foreground sm:px-5">{children}</div>
  );
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={
        "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors " +
        (active
          ? "bg-black text-white shadow-sm"
          : "text-muted-foreground hover:bg-orange-50 hover:text-ink")
      }
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 rounded-[28px] border border-black/5 bg-gradient-to-br from-white via-orange-50 to-sky-50 p-6 shadow-card md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "bg-white",
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className={`${tone} rounded-[22px] border border-black/5 p-5 text-black shadow-card`}>
      <p className="text-xs font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
      {children}
    </span>
  );
}
