import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, CreditCard } from "lucide-react";

import { LearnerShell, PageHeader, StatusPill } from "@/components/app-shell";
import { ErrorState } from "@/components/states";
import { createCheckoutFn, verifyDemoPaymentFn } from "@/lib/platform-server";
import { EXAM_PACKAGE_OPTIONS, getPlan } from "@/lib/platform-model";

export const Route = createFileRoute("/checkout/$plan")({
  head: () => ({ meta: [{ title: "Checkout | UPQuizBazaar" }] }),
  validateSearch: (search) => ({
    exam: typeof search.exam === "string" ? search.exam : "UPTET_CTET",
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { plan } = Route.useParams();
  const { exam } = Route.useSearch();
  const selectedPlan = getPlan(plan);
  const selectedExam =
    EXAM_PACKAGE_OPTIONS.find((option) => option.code === exam) ?? EXAM_PACKAGE_OPTIONS[2];
  const checkout = useMutation({
    mutationFn: () =>
      createCheckoutFn({
        data: {
          packageSlug: plan as "starter" | "complete" | "premium",
          examCode: selectedExam.code as
            "UP_PCS" | "RO_ARO" | "UPTET_CTET" | "UP_PET" | "UP_Lekhpal" | "UP_Police",
        },
      }),
  });
  const verify = useMutation({
    mutationFn: (paymentId: string) => verifyDemoPaymentFn({ data: { paymentId } }),
  });

  return (
    <LearnerShell>
      <PageHeader eyebrow="Secure checkout" title="Checkout" />
      {!selectedPlan && (
        <ErrorState title="Package unavailable">This plan is not configured.</ErrorState>
      )}
      {selectedPlan && (
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <StatusPill>{selectedExam.name}</StatusPill>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">
              {selectedExam.name} {selectedPlan.name} Package
            </h2>
            <p className="mt-2 text-muted-foreground">
              {selectedPlan.tagline} This unlocks {selectedExam.name} content only.
            </p>
            <p className="mt-5 text-5xl font-extrabold text-ink">₹{selectedPlan.priceInr}</p>
            <ul className="mt-6 space-y-3">
              {selectedPlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <CheckCircle2 className="size-4 text-jade" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
              className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              <CreditCard className="mr-2 size-4" />
              {checkout.isPending ? "Opening checkout" : "Start Paddle test checkout"}
            </button>
            {checkout.isError && (
              <ErrorState title="Payment failed">{checkout.error.message}</ErrorState>
            )}
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <AlertTriangle className="size-4" />
              Test mode
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Provider setup is pending confirmation. This records a pending payment and keeps
              access locked until a verified server-side payment state exists.
            </p>
            {checkout.data && (
              <div className="mt-5 rounded-xl bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-ink">Payment created</p>
                  <StatusPill>{checkout.data.status}</StatusPill>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{checkout.data.message}</p>
                <button
                  onClick={() => verify.mutate(checkout.data.id)}
                  className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"
                >
                  Simulate verified webhook
                </button>
              </div>
            )}
            {verify.data && (
              <div className="mt-4 rounded-xl bg-jade/10 p-4 text-sm text-jade">
                Verified test payment for {verify.data.examName}.{" "}
                <Link to="/tests" className="font-bold underline">
                  Go to tests
                </Link>
              </div>
            )}
          </aside>
        </section>
      )}
    </LearnerShell>
  );
}
