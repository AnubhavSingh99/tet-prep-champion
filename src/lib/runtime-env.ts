const SERVER_ENV_KEYS = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
] as const;

function getRuntimeValue(env: unknown, key: string) {
  if (!env || typeof env !== "object" || !(key in env)) return undefined;
  const value = (env as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

export function normalizeEnvValue(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  const quote = trimmed[0];
  const last = trimmed[trimmed.length - 1];

  if (
    trimmed.length >= 2 &&
    ((quote === `"` && last === `"`) ||
      (quote === `'` && last === `'`) ||
      (quote === "`" && last === "`"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export function hydrateProcessEnv(runtimeEnv: unknown) {
  for (const key of SERVER_ENV_KEYS) {
    const runtimeValue = normalizeEnvValue(getRuntimeValue(runtimeEnv, key));
    const currentValue = normalizeEnvValue(process.env[key]);

    if (runtimeValue && runtimeValue !== currentValue) {
      process.env[key] = runtimeValue;
    } else if (currentValue) {
      process.env[key] = currentValue;
    }
  }
}

export function getServerEnv(key: (typeof SERVER_ENV_KEYS)[number]) {
  return normalizeEnvValue(process.env[key]);
}
