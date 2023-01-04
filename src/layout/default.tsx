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
      <main
        className="flex min-h-screen flex-col items-center"
        style={{
          backgroundColor: "rgb(30, 41, 59)",
          backgroundImage:
            "radial-gradient(at 100% 0%, rgb(59, 130, 246) 0, transparent 80%), radial-gradient(at 0% 5%, rgb(147, 51, 234) 0, transparent 50%);",
        }}
      >
        <Header />
        {props.children}
      </main>
    </>
  );
};

export default DefaultLayout;
