import Head from "next/head";
import Header from "../components/Header";

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
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2563eb] to-[#1e293b]">
        <Header />
        {props.children}
      </main>
      {/*<Footer />*/}
    </>
  );
};

export default DefaultLayout;
