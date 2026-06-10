"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AuthSession } from "./auth-storage";
import { getAuthSession, subscribeAuthSession } from "./auth-storage";

export function useRequireAuth() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    function checkSession() {
      const currentSession = getAuthSession();

      setSession(currentSession);
      setIsChecking(false);

      if (!currentSession?.accessToken) {
        router.replace("/login");
      }
    }

    checkSession();

    const unsubscribe = subscribeAuthSession(checkSession);

    return () => {
      unsubscribe();
    };
  }, [router]);

  return {
    isChecking,
    isAuthorized: Boolean(session?.accessToken),
    session,
  };
}