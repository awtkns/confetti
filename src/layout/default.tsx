import Head from "next/head";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { z } from "zod";

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status != "authenticated" || !session?.user || session?.user?.email)
      return;

    const user = session.user;
    z.string()
      .email()
      .parseAsync(user.email)
      .catch(() => window.localStorage.setItem("uuid", user.id));
  }, [session, status]);

  return (
    <>
      <Head>
        <title>Estimator</title>
        <meta name="description" content="Estimation with confetti!" />
        <meta
          property="og:image"
          content="https://estimator.awtkns.com/api/og"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2563eb] to-[#1e293b]">
        <Header />
        {props.children}
      </main>
    </>
  );
};

export default DefaultLayout;
