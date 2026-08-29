import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { LearnerShell, PageHeader, StatusPill } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { getDashboardFn } from "@/lib/platform-server";

export const Route = createFileRoute("/purchases")({
  head: () => ({ meta: [{ title: "Purchases | UPQuizBazaar" }] }),
  component: PurchasesPage,
});

function PurchasesPage() {
  const query = useQuery({ queryKey: ["dashboard", "purchases"], queryFn: () => getDashboardFn() });
  return (
    <LearnerShell>
      <PageHeader eyebrow="Payment state" title="Purchases">
        <Link
          to="/#pricing"
          className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          View plans
        </Link>
      </PageHeader>
      {query.isLoading && <LoadingState label="Loading purchases" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && !query.data.purchases.length && (
        <EmptyState title="No purchases yet">
          Payment attempts, failures and verified package activations will show here.
        </EmptyState>
      )}
      {query.data && (
        <div className="space-y-4">
          {query.data.purchases.map((payment) => (
            <article
              key={payment.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-extrabold text-ink">{payment.packageName}</h2>
                  <p className="text-sm text-muted-foreground">{payment.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-ink">₹{payment.amountInr}</p>
                  <StatusPill>{payment.status}</StatusPill>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </LearnerShell>
  );
}
