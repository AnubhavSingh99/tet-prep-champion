import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/use-auth-session";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in | UPQuizBazaar" }] }),
  component: AuthPage,
});

function AuthPage() {
  const session = useAuthSession();
  const requestedRedirect =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("redirect");
  const redirectTo = requestedRedirect?.startsWith("/") ? requestedRedirect : "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      window.location.replace(redirectTo);
    }
  }, [redirectTo, session.status]);

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name: fullName } },
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }
      setMessage(
        mode === "signup"
          ? "Account created. Check your email if confirmation is enabled."
          : "Signed in.",
      );
      window.location.replace(redirectTo);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication is unavailable in this environment.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setMessage("");
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    });
    if (result.error) {
      setMessage(result.error.message || "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream bg-grain px-5 py-8 text-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_420px] md:items-center">
        <section>
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-ink">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            UP<span className="text-primary">Quiz</span>Bazaar
          </Link>
          <h1 className="mt-8 max-w-lg text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Your TET prep stays saved across every attempt.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Sign in to unlock learner routes, purchases, timed tests, wrong-question practice and
            profile records.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex rounded-full bg-secondary p-1">
            {(["signin", "signup"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={
                  "flex-1 rounded-full px-4 py-2 text-sm font-bold " +
                  (mode === item ? "bg-primary text-primary-foreground" : "text-muted-foreground")
                }
              >
                {item === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {mode === "signup" && (
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              type="email"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          )}

          <button
            onClick={() => void submit()}
            disabled={busy || !email || !password}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            <Mail className="mr-2 size-4" />
            {busy ? "Please wait" : mode === "signin" ? "Sign in with email" : "Create account"}
          </button>
          <button
            onClick={() => void signInWithGoogle()}
            disabled={busy}
            className="mt-3 w-full rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-ink"
          >
            Continue with Google
          </button>
        </section>
      </div>
    </div>
  );
}
