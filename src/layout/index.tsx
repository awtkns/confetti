import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Estimator</title>
        <meta name="description" content="Estimation, but fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*<Header />*/}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {props.children}
      </main>
      {/*<Footer />*/}
    </>
  );
};

export default Layout;
