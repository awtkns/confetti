import type { AuthOptions } from "next-auth";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { getCookie, setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { decode, encode } from "next-auth/jwt";
import { randomUUID } from "crypto";
import { z } from "zod";

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

const adapter = PrismaAdapter(prisma);

const monthFromNow = () => {
  const now = new Date(Date.now());
  return new Date(now.setMonth(now.getMonth() + 1));
};

const credentialsValidator = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
});

const providers = [
  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  GithubProvider({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  CredentialsProvider({
    id: "anonymous",
    name: "Credentials",
    credentials: {
      id: { type: "text" },
      name: {
        label: "Display Name",
        type: "text",
        placeholder: "Anonymous",
      },
    },
    async authorize(credentials, req) {
      const creds = credentialsValidator.parse(credentials);

      if (creds.id) {
        let user = await adapter.getUser(creds.id);
        if (user) {
          if (user.name != creds.name) {
            user = await adapter.updateUser({ id: user.id, name: creds.name });
          }
          return user;
        }
      }

      return adapter.createUser({
        name: creds.name,
        email: "",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
        emailVerified: null,
      });
    },
  }),
];

function anonymousAuth(req: NextApiRequest) {
  return (
    req.query.nextauth?.includes("callback") &&
    req.query.nextauth.includes("anonymous") &&
    req.method === "POST"
  );
}

const authOptions: NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
): AuthOptions => {
  return {
    callbacks: {
      async session({ session, user }) {
        if (session.user) session.user.id = user.id;
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        if (anonymousAuth(req) && user) {
          const session = await adapter.createSession({
            sessionToken: randomUUID?.(),
            userId: user.id,
            expires: monthFromNow(),
          });

          setCookie("next-auth.session-token", session.sessionToken, {
            expires: session.expires,
            req: req,
            res: res,
          });
        }

        return true;
      },
    },
    session: {
      maxAge: 30 * 24 * 60 * 60, // 30 day
      updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (anonymousAuth(req)) {
          const cookie = getCookie("next-auth.session-token", {
            req: req,
            res: res,
          });

          return cookie ? cookie.toString() : "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (anonymousAuth(req)) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    adapter: adapter,
    providers: providers,
  };
};

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions(req, res));

export default auth;

export const ssrOptions: NextAuthOptions = {
  adapter: adapter,
  providers: providers,
};
