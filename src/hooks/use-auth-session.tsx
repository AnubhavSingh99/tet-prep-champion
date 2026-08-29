import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

type AuthState =
  | { status: "loading"; email?: string; unavailable?: false }
  | { status: "authenticated"; email: string; unavailable?: false }
  | { status: "unauthenticated"; email?: string; unavailable?: false }
  | { status: "unavailable"; email: string; unavailable: true };

export function useAuthSession(): AuthState {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let mounted = true;
    if (window.localStorage.getItem("upquizbazaar_demo_session") === "1") {
      setState({
        status: "unavailable",
        email: "demo@upquizbazaar.example",
        unavailable: true,
      });
      return () => {
        mounted = false;
      };
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const email = data.session?.user.email;
        setState(email ? { status: "authenticated", email } : { status: "unauthenticated" });
      })
      .catch(() => {
        if (!mounted) return;
        setState({
          status: "unavailable",
          email: "demo@upquizbazaar.example",
          unavailable: true,
        });
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user.email;
      setState(email ? { status: "authenticated", email } : { status: "unauthenticated" });
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function startDemoSession() {
  window.localStorage.setItem("upquizbazaar_demo_session", "1");
}

export function clearDemoSession() {
  window.localStorage.removeItem("upquizbazaar_demo_session");
}
