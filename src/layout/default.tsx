import Head from "next/head";
import Header from "../components/Header";

import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  useAuth();

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
