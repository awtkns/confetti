import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/router";

const UUID_KEY = "uuid";

type Provider = "anonymous" | "google" | "github";

interface Auth {
  signIn: (provider: Provider, name?: string) => void;
}

export function useAuth(): Auth {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != "authenticated" || !session?.user) return;

    const user = session.user;
    z.string()
      .uuid()
      .parseAsync(user.email)
      .then((uuid) => window.localStorage.setItem(UUID_KEY, uuid))
      .catch();
  }, [session, status]);

  const handleSignIn = async (provider: Provider, name?: string) => {
    let callbackUrl = `/${
      typeof router.query.room == "string" ? router.query.room : ""
    }`;
    callbackUrl = encodeURI(callbackUrl);

    const uuid =
      provider == "anonymous" ? window.localStorage.getItem(UUID_KEY) : null;

    await signIn(provider, {
      callbackUrl,
      name,
      ...(uuid && { uuid }),
    });
  };

  return {
    signIn: handleSignIn,
  };
}
