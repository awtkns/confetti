import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";

import DefaultLayout from "../layout/default";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

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
