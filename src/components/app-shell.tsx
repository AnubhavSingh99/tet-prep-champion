import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpenCheck,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

import { UnavailableState, UnauthorizedState } from "./states";
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
  if (session.status === "unauthenticated") {
    return (
      <ShellFrame>
        <UnauthorizedState admin />
      </ShellFrame>
    );
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
  if (session.status === "unauthenticated") {
    return (
      <ShellFrame>
        <UnauthorizedState />
      </ShellFrame>
    );
  }

  return (
    <ShellFrame>
      {session.status === "unavailable" && <UnavailableState />}
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-3 shadow-card">
          <Link to="/" className="mb-3 flex items-center gap-2 px-2 py-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Trophy className="size-5" />
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
            onClick={() => {
              clearDemoSession();
              void supabase.auth.signOut();
              window.location.assign("/");
            }}
            className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </ShellFrame>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-cream bg-grain px-5 py-6 text-foreground">{children}</div>;
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors " +
        (active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-ink")
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
    <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-6 shadow-card md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
      {children}
    </span>
  );
}
