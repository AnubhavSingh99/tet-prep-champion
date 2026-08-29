import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { LearnerShell, PageHeader, StatusPill } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { getLeaderboardFn } from "@/lib/platform-server";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard | UPQuizBazaar" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const query = useQuery({ queryKey: ["leaderboard"], queryFn: () => getLeaderboardFn() });
  return (
    <LearnerShell>
      <PageHeader eyebrow="Rank table" title="Leaderboard" />
      {query.isLoading && <LoadingState label="Loading ranks" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-ink">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {query.data.map((entry) => (
                <tr key={entry.rank} className="border-t border-border">
                  <td className="px-4 py-3 font-extrabold text-primary">#{entry.rank}</td>
                  <td className="px-4 py-3 font-bold text-ink">{entry.name}</td>
                  <td className="px-4 py-3">
                    <StatusPill>{entry.score}%</StatusPill>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LearnerShell>
  );
}
