import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  createCheckout,
  createCheckoutForUser,
  getAdminOverview,
  getAdminOverviewForUser,
  getAttemptResult,
  getAttemptResultForUser,
  getCatalogForUser,
  getDashboard,
  getDashboardForUser,
  getLeaderboard,
  getLeaderboardForUser,
  getPackages,
  getProfile,
  getProfileForUser,
  getTestRunner,
  getTestRunnerForUser,
  getTestsForLearner,
  getWrongQuestions,
  getWrongQuestionsForUser,
  markDemoPaymentVerified,
  markPaymentVerifiedForUser,
  submitAttempt,
  submitAttemptForUser,
  updateProfile,
  updateProfileForUser,
  type AuthContext,
} from "./platform-store";

const planSlug = z.enum(["starter", "complete", "premium"]);
const examCode = z.enum(["UP_PCS", "RO_ARO", "UPTET_CTET", "UP_PET", "UP_Lekhpal", "UP_Police"]);

export const getPackagesFn = createServerFn({ method: "GET" }).handler(async () => getPackages());

function authContext(context: Record<string, unknown>): AuthContext {
  return {
    userId: String(context.userId),
    claims: context.claims as AuthContext["claims"],
  };
}

export const getDashboardFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getDashboardForUser(authContext(context)));

export const getCatalogFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => ({
    tests: await getCatalogForUser(authContext(context)),
  }));

export const getTestRunnerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ testSlug: z.string() }))
  .handler(async ({ data, context }) => {
    const payload = await getTestRunnerForUser(data.testSlug, authContext(context));
    if (!payload) throw new Error("Test unavailable");
    return payload;
  });

export const submitAttemptFn = createServerFn({ method: "POST" })
  .validator(z.object({ attemptId: z.string(), answers: z.record(z.string()) }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => submitAttemptForUser(data, authContext(context)));

export const getAttemptResultFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ data, context }) => {
    const result = await getAttemptResultForUser(data.attemptId, authContext(context));
    if (!result) throw new Error("Result unavailable");
    return result;
  });

export const getWrongQuestionsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getWrongQuestionsForUser(authContext(context)));

export const getLeaderboardFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getLeaderboardForUser(authContext(context)));

export const createCheckoutFn = createServerFn({ method: "POST" })
  .validator(z.object({ packageSlug: planSlug, examCode }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => createCheckoutForUser(data, authContext(context)));

export const verifyDemoPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ paymentId: z.string() }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) =>
    markPaymentVerifiedForUser(data.paymentId, authContext(context)),
  );

export const getProfileFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getProfileForUser(authContext(context)));

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator(z.object({ fullName: z.string(), examGoal: z.string() }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => updateProfileForUser(data, authContext(context)));

export const getAdminOverviewFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getAdminOverviewForUser(authContext(context)));
