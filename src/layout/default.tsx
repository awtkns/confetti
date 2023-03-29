import Head from "next/head";

import { useAuth } from "@/hooks/useAuth";

import Header from "@/components/Header";


interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  useAuth();

  const description =
    "Get your estimation party started with confetti, the ultimate tool for a festive and productive estimate session";

  return (
    <>
      <Head>
        <title>Confetti</title>
        <meta property="description" content={description} />
        <meta name="twitter:site" content="@confetti" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Confetti 🎉" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://confetti.dev/social.png" />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="640" />
        <meta property="og:title" content="Confetti 🎉" key="title" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://confetti.dev" />
        <meta property="og:image" content="https://confetti.dev/social.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex-col flex bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main className="flex flex-col items-center justify-between flex-1">
          {props.children}
        </main>
      </div>
    </>
  );
};

export default DefaultLayout;