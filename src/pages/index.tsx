import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import {useState} from "react";
import supabase from "../server/supabase";

const FIB = [1, 2, 3, 5, 8, 13];
const FIB_EVENT = 'fib';

const Home: NextPage = () => {
  const [fib, setFib] = useState(8);

  const channel = supabase
      .channel("room1")
      .subscribe()
      .on('broadcast', { event: FIB_EVENT }, ({payload}) => {
          console.log(payload)
          setFib(payload.value)
        })

  function handleClick() {
        const s = new Set(FIB)

        s.delete(fib)
        const x = Array.from(s)[Math.floor(Math.random() * s.size)] || 0

        channel
            .send({type: 'broadcast', event: FIB_EVENT, payload: {value: x}})
            .then(() => setFib(x))
  }

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Estimator</title>
        <meta name="description" content="Estimation, but fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-10xl font-extrabold tracking-tight text-white sm:text-[8rem]">
            Estim<span className="text-[hsl(280,100%,70%)]">
            <button onClick={handleClick}>{fib}</button>
          </span>r
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
