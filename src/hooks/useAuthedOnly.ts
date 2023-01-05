import { useSession } from "next-auth/react";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAuthedOnly(redirect: (router: NextRouter) => void) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "unauthenticated" || !router.isReady) return;
    redirect(router);
  }, [status, router, redirect]);
}
