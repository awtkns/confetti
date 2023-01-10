import Head from "next/head";

import { useAuth } from "@/hooks/useAuth";

import Header from "@/components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  useAuth();

  return (
    <>
      <Head>
        <title>Confetti</title>
        <meta property="og:title" content="Confetti" key="title" />
        <meta
          name="description"
          content="Get your estimation party started with confetti!"
        />
        <meta property="og:image" content="https://confetti.dev/social.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen flex-col flex"
        style={{
          backgroundColor: "rgb(30, 41, 59)",
          backgroundImage:
            "radial-gradient(at 100% 0%, rgb(59, 130, 246) 0, transparent 80%), radial-gradient(at 0% 5%, rgb(147, 51, 234) 0, transparent 50%)",
        }}
      >
        <Header />
        <main className="flex flex-col items-center justify-between flex-1">
          {props.children}
        </main>
      </div>
    </>
  );
};

export default DefaultLayout;
