import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpenCheck,
  CreditCard,
  Database,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { AdminShell, PageHeader, StatCard, StatusPill } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { getAdminOverviewFn } from "@/lib/platform-server";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | UPQuizBazaar" }] }),
  component: AdminPage,
});

function AdminPage() {
  const query = useQuery({ queryKey: ["admin-overview"], queryFn: () => getAdminOverviewFn() });
  return (
    <AdminShell>
      <PageHeader eyebrow="Role-gated area" title="Admin overview" />
      {query.isLoading && <LoadingState label="Loading admin workspace" />}
      {query.isError && <ErrorState title="Admin unavailable">{query.error.message}</ErrorState>}
      {query.data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Learners" value={query.data.metrics.learners} />
            <StatCard label="Revenue" value={`₹${query.data.metrics.revenueInr}`} />
            <StatCard label="Attempts" value={query.data.metrics.attempts} />
            <StatCard label="Questions" value={query.data.metrics.questions} />
          </div>

          <AdminSection icon={Package} title="Packages">
            {query.data.packages.map((plan) => (
              <Row
                key={plan.slug}
                main={`${plan.name} - ₹${plan.priceInr}`}
                sub={`${plan.features.length} features configured`}
              >
                {plan.badge && <StatusPill>{plan.badge}</StatusPill>}
              </Row>
            ))}
          </AdminSection>

          <AdminSection icon={BookOpenCheck} title="Tests and questions">
            {query.data.tests.map((test) => (
              <Row
                key={test.id}
                main={test.title}
                sub={`${test.examName ?? "All exams"} · ${test.categoryName} · ${test.questionCount} questions · ${test.packageSlug}`}
              >
                <StatusPill>
                  {test.isUnlocked ? "unlocked" : (test.accessKind ?? "paid")}
                </StatusPill>
              </Row>
            ))}
          </AdminSection>

          <AdminSection icon={Users} title="Users">
            {query.data.users.map((user) => (
              <Row key={user.id} main={user.fullName} sub={`${user.email} · ${user.examGoal}`}>
                <StatusPill>{user.roles.join(", ")}</StatusPill>
              </Row>
            ))}
          </AdminSection>

          <AdminSection icon={BarChart3} title="Attempts and results">
            {query.data.attempts.length ? (
              query.data.attempts.map((attempt) => (
                <Row
                  key={attempt.id}
                  main={attempt.testTitle}
                  sub={`${attempt.status} · ${attempt.percentage ?? 0}%`}
                >
                  <StatusPill>{attempt.status}</StatusPill>
                </Row>
              ))
            ) : (
              <EmptyState title="No attempts">Learner submissions will appear here.</EmptyState>
            )}
          </AdminSection>

          <AdminSection icon={CreditCard} title="Payments">
            {query.data.payments.length ? (
              query.data.payments.map((payment) => (
                <Row
                  key={payment.id}
                  main={`${payment.packageName} - ₹${payment.amountInr}`}
                  sub={`${payment.examName ?? "Exam"} · ${payment.message}`}
                >
                  <StatusPill>{payment.status}</StatusPill>
                </Row>
              ))
            ) : (
              <EmptyState title="No payments">Package purchases will appear here.</EmptyState>
            )}
          </AdminSection>

          <AdminSection icon={Database} title="Categories">
            {query.data.categories.map((category) => (
              <Row key={category.id} main={category.name} sub={category.description} />
            ))}
          </AdminSection>

          <AdminSection icon={Settings} title="Settings">
            {query.data.settings.map((setting) => (
              <Row key={setting.key} main={setting.key} sub={setting.value} />
            ))}
          </AdminSection>
        </div>
      )}
    </AdminShell>
  );
}

function AdminSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Package;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Row({ main, sub, children }: { main: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 md:flex-row md:items-center">
      <div>
        <p className="font-bold text-ink">{main}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
      {children}
    </div>
  );
}
