import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createCheckout,
  getAdminOverview,
  getAttemptResult,
  getDashboard,
  getLeaderboard,
  getPackages,
  getProfile,
  getTestRunner,
  getTestsForLearner,
  getWrongQuestions,
  markDemoPaymentVerified,
  submitAttempt,
  updateProfile,
} from "./platform-store";

const planSlug = z.enum(["starter", "complete", "premium"]);
const examCode = z.enum(["UP_PCS", "RO_ARO", "UPTET_CTET", "UP_PET", "UP_Lekhpal", "UP_Police"]);

export const getPackagesFn = createServerFn({ method: "GET" }).handler(async () => getPackages());

export const getDashboardFn = createServerFn({ method: "GET" }).handler(async () => getDashboard());

export const getCatalogFn = createServerFn({ method: "GET" }).handler(async () => ({
  tests: getTestsForLearner(),
}));

export const getTestRunnerFn = createServerFn({ method: "GET" })
  .validator(z.object({ testSlug: z.string() }))
  .handler(async ({ data }) => {
    const payload = getTestRunner(data.testSlug);
    if (!payload) throw new Error("Test unavailable");
    return payload;
  });

export const submitAttemptFn = createServerFn({ method: "POST" })
  .validator(z.object({ attemptId: z.string(), answers: z.record(z.string()) }))
  .handler(async ({ data }) => submitAttempt(data));

export const getAttemptResultFn = createServerFn({ method: "GET" })
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ data }) => {
    const result = getAttemptResult(data.attemptId);
    if (!result) throw new Error("Result unavailable");
    return result;
  });

export const getWrongQuestionsFn = createServerFn({ method: "GET" }).handler(async () =>
  getWrongQuestions(),
);

export const getLeaderboardFn = createServerFn({ method: "GET" }).handler(async () =>
  getLeaderboard(),
);

export const createCheckoutFn = createServerFn({ method: "POST" })
  .validator(z.object({ packageSlug: planSlug, examCode }))
  .handler(async ({ data }) => createCheckout(data));

export const verifyDemoPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ paymentId: z.string() }))
  .handler(async ({ data }) => markDemoPaymentVerified(data.paymentId));

export const getProfileFn = createServerFn({ method: "GET" }).handler(async () => getProfile());

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator(z.object({ fullName: z.string(), examGoal: z.string() }))
  .handler(async ({ data }) => updateProfile(data));

export const getAdminOverviewFn = createServerFn({ method: "GET" }).handler(async () =>
  getAdminOverview(),
);
