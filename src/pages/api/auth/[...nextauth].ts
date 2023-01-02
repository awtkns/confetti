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
import { imageUrl } from "../../../server/common/images";

const adapter = PrismaAdapter(prisma);

const monthFromNow = () => {
  const now = new Date(Date.now());
  return new Date(now.setMonth(now.getMonth() + 1));
};

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
    type: "credentials",
    id: "anonymous",
    name: "Credentials",
    credentials: {
      uuid: {
        label: "",
        type: "hidden",
      },
      name: {
        label: "Display Name",
        placeholder: "Anonymous",
      },
    },
    async authorize(credentials) {
      if (!credentials) return null;

      const name = await z
        .string()
        .min(1)
        .parseAsync(credentials.name)
        .catch(() => null);

      if (!name) return null;

      const uuid = await z
        .string()
        .uuid()
        .optional()
        .parseAsync(credentials.uuid)
        .catch(() => null);

      if (uuid) {
        let user = await adapter.getUserByEmail(uuid);
        if (user) {
          if (user.name != name) {
            user = await adapter.updateUser({
              id: user.id,
              name: name,
              image: imageUrl(user.email, name),
            });
          }
          return user;
        }
      }

      const email = randomUUID?.();
      return adapter.createUser({
        name: name,
        email: email,
        image: imageUrl(email, name),
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

const options = (req: NextApiRequest, res: NextApiResponse): AuthOptions => {
  return {
    callbacks: {
      async session({ session, user }) {
        if (session.user) session.user.id = user.id;
        return session;
      },
      async signIn({ user }) {
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
  NextAuth(req, res, options(req, res));

export default auth;

export const authOptions: NextAuthOptions = {
  adapter: adapter,
  providers: providers,
};
