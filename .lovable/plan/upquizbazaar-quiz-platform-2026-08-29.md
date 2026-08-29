# UPQuizBazaar quiz platform

## User-facing scope
- Preserve the approved landing page and connect its navigation and plan CTAs to real routes and checkout.
- Add email/password and Google authentication with profile records, session persistence, protected learner routes, and a separate admin area.
- Add learner flows for dashboard, test catalog, timed quiz taking, attempts, results, solutions, wrong-question review, re-attempts, leaderboard, profile, and purchases.
- Add admin flows for overview metrics, users, packages, tests, questions, categories, attempts/results, payments, and settings.
- Keep loading, empty, error, unauthorized, unavailable, expired, and payment-failure states visible across major flows.

## Delivery phases
1. **Cloud foundation** — create relational tables, roles, profiles, seeded packages/categories/content, ownership rules, and server-side policies.
2. **Auth and shared shell** — add public auth routes, route protection, profile creation/update, session-aware navigation, and learner/admin shells.
3. **Learner experience** — build dashboard/catalog pages, access checks, test runner with persisted in-progress state, submission/grading, result and solution views, wrong questions, re-attempts, leaderboard, profile, and purchases.
4. **Payments** — after provider confirmation, connect Paddle test checkout, server-side confirmation/webhook architecture, idempotent activation, failed/cancelled states, and package entitlements.
5. **Admin experience** — build role-gated management pages and CRUD for packages, tests, questions, categories, users, attempts/results, payments, and dashboard metrics.
6. **Verification** — run the learner and admin flows end to end, check responsive behavior, route metadata, build/type diagnostics, and fix broken links or runtime errors.

## Technical details
- Use TanStack Start routes and `createServerFn` for app-internal server logic; no new Edge Functions.
- Keep server-function modules thin and keep secrets/server-only clients inside handlers.
- Use a separate `user_roles` table with a security-definer role helper; never store roles on profiles/users.
- Store payment and entitlement state separately; only verified payment state grants package access.
- Protect answer keys during active attempts and compute result data server-side.
- Use generated Cloud auth integrations and bearer attachment; do not edit generated integration files.
- Seed the three existing plans (₹29 Starter, ₹49 Complete, ₹99 Premium) in the database and preserve the existing landing-page copy and visual tokens.
- Payment provider setup is pending user confirmation; use test mode first and leave live credentials/configuration as an explicit deployment step.
