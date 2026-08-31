import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "./runtime-env";
import type { AuthContext } from "./platform-store";

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export async function requireApiAuth(request: Request): Promise<AuthContext> {
  const supabaseUrl = getServerEnv("SUPABASE_URL");
  const supabasePublishableKey = getServerEnv("SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Response("Supabase server environment is not configured", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token || token.split(".").length !== 3) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      fetch: createSupabaseFetch(supabasePublishableKey),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return {
    userId: data.claims.sub,
    claims: {
      email: typeof data.claims.email === "string" ? data.claims.email : undefined,
      user_metadata:
        typeof data.claims.user_metadata === "object" && data.claims.user_metadata
          ? (data.claims.user_metadata as AuthContext["claims"]["user_metadata"])
          : undefined,
    },
  };
}
