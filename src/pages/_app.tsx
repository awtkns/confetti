import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import DefaultLayout from "../layout/default";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DefaultLayout>
        <Component {...pageProps} />
        <Analytics />
      </DefaultLayout>
    </SessionProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export default trpc.withTRPC(MyApp);
