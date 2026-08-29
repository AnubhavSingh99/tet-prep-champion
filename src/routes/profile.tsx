import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { LearnerShell, PageHeader } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { getProfileFn, updateProfileFn } from "@/lib/platform-server";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile | UPQuizBazaar" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["profile"], queryFn: () => getProfileFn() });
  const [fullName, setFullName] = useState("");
  const [examGoal, setExamGoal] = useState("");
  const mutation = useMutation({
    mutationFn: () => updateProfileFn({ data: { fullName, examGoal } }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["profile"] }),
  });

  useEffect(() => {
    if (query.data) {
      setFullName(query.data.fullName);
      setExamGoal(query.data.examGoal);
    }
  }, [query.data]);

  return (
    <LearnerShell>
      <PageHeader eyebrow="Account" title="Profile" />
      {query.isLoading && <LoadingState label="Loading profile" />}
      {query.isError && <ErrorState>{query.error.message}</ErrorState>}
      {query.data && (
        <section className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-card">
          <label className="text-sm font-bold text-ink">
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-ink">
            Exam goal
            <input
              value={examGoal}
              onChange={(event) => setExamGoal(event.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </label>
          <p className="mt-4 text-sm text-muted-foreground">Email: {query.data.email}</p>
          {mutation.isError && <ErrorState>{mutation.error.message}</ErrorState>}
          {mutation.isSuccess && (
            <p className="mt-4 rounded-xl bg-jade/10 p-3 text-sm font-semibold text-jade">
              Profile saved.
            </p>
          )}
          <button
            onClick={() => mutation.mutate()}
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            <Save className="mr-2 size-4" />
            Save profile
          </button>
        </section>
      )}
    </LearnerShell>
  );
}
