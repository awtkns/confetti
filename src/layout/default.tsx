import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Estimator</title>
        <meta name="description" content="Estimation, but fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*<Header />*/}
      {/*<header>dsd</header>*/}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2563eb] to-[#1e293b]">
        {props.children}
      </main>
      {/*<Footer />*/}
    </>
  );
};

export default DefaultLayout;
