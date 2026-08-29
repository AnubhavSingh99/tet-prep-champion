import { Link } from "@tanstack/react-router";
import { AlertCircle, Lock, Loader2, WifiOff } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border bg-card p-8 text-sm font-semibold text-muted-foreground shadow-card">
      <Loader2 className="mr-2 size-4 animate-spin text-primary" />
      {label}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-card">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-card p-6 text-sm shadow-card">
      <div className="flex items-center gap-2 font-bold text-destructive">
        <AlertCircle className="size-4" />
        {title}
      </div>
      <p className="mt-2 text-muted-foreground">{children}</p>
    </div>
  );
}

export function UnavailableState() {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-ink">
      <div className="flex items-center gap-2 font-bold">
        <WifiOff className="size-4 text-primary" />
        Cloud auth unavailable locally
      </div>
      <p className="mt-1 text-muted-foreground">
        The app is running in demo mode until Supabase/Lovable credentials are active in this
        environment.
      </p>
    </div>
  );
}

export function UnauthorizedState({ admin = false }: { admin?: boolean }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-card">
      <Lock className="mx-auto size-9 text-primary" />
      <h1 className="mt-4 text-2xl font-extrabold text-ink">
        {admin ? "Admin access required" : "Sign in to continue"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {admin
          ? "This area is protected for platform administrators."
          : "Your tests, attempts, purchases and profile are kept behind your account session."}
      </p>
      <Link
        to="/auth"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-card"
      >
        Go to sign in
      </Link>
    </div>
  );
}
