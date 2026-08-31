import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, CreditCard } from "lucide-react";

import { LearnerShell, PageHeader, StatusPill } from "@/components/app-shell";
import { ErrorState } from "@/components/states";
import { EXAM_PACKAGE_OPTIONS, getPlan } from "@/lib/platform-model";
import { supabase } from "@/integrations/supabase/client";

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    description?: string;
    reason?: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpaySuccessResponse) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  async function getBearerToken() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      throw new Error("Please sign in before checkout.");
    }
    return {
      token: data.session.access_token,
      email: data.session.user.email,
      name:
        String(data.session.user.user_metadata?.full_name ?? "") ||
        String(data.session.user.user_metadata?.name ?? ""),
    };
  }

  async function postJson<T>(url: string, token: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "Payment request failed");
    }
    return payload as T;
  }

  function loadRazorpayScript() {
    if (window.Razorpay) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Razorpay checkout failed to load")),
          {
            once: true,
          },
        );
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay checkout failed to load"));
      document.body.appendChild(script);
    });
  }

  const checkout = useMutation({
    mutationFn: async () => {
      setPaymentError(null);
      setCancelled(false);
      const session = await getBearerToken();
      const order = await postJson<{
        payment_id: string;
        order_id: string;
        key_id: string;
        amount: number;
        currency: string;
        package_name: string;
        exam_name: string;
        message: string;
      }>("/api/create-order", session.token, {
        packageSlug: plan,
        examCode: selectedExam.code,
      });

      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      return await new Promise<{
        payment_id: string;
        status: string;
        package_name: string;
        exam_name: string;
        message: string;
      }>((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "UP Quiz Bazaar",
          description: order.package_name,
          order_id: order.order_id,
          prefill: {
            email: session.email,
            name: session.name,
          },
          theme: {
            color: "#ff6b00",
          },
          modal: {
            ondismiss: () => {
              setCancelled(true);
              reject(new Error("Payment cancelled. Your package was not activated."));
            },
          },
          handler: async (response) => {
            try {
              const verified = await postJson<{
                payment_id: string;
                status: string;
                package_name: string;
                exam_name: string;
                message: string;
              }>("/api/verify-payment", session.token, response);
              resolve(verified);
            } catch (error) {
              reject(error);
            }
          },
        });
        razorpay.on("payment.failed", (response) => {
          reject(
            new Error(
              response.error?.description ||
                response.error?.reason ||
                "Payment failed. Your package was not activated.",
            ),
          );
        });
        razorpay.open();
      });
    },
    onError: (error) => {
      setPaymentError(error instanceof Error ? error.message : "Payment failed");
    },
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
              {checkout.isPending ? "Opening Razorpay" : "Pay with Razorpay"}
            </button>
            {paymentError && (
              <ErrorState title={cancelled ? "Payment cancelled" : "Payment failed"}>
                {paymentError}
              </ErrorState>
            )}
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <AlertTriangle className="size-4" />
              Razorpay test mode
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This opens Razorpay Standard Checkout. Access unlocks only after the server verifies
              Razorpay's payment signature.
            </p>
            {checkout.data && (
              <div className="mt-5 rounded-xl bg-jade/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-ink">Payment verified</p>
                  <StatusPill>{checkout.data.status}</StatusPill>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{checkout.data.message}</p>
              </div>
            )}
            {checkout.data && (
              <div className="mt-4 rounded-xl bg-jade/10 p-4 text-sm text-jade">
                Verified test payment for {checkout.data.exam_name}.{" "}
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
