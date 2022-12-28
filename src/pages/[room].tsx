import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import Link from "next/link";
import ResultsTable from "../components/ResultsTable";
import type { User } from "../types/game";
import { GameState } from "../types/game";
import { useEstimationChannel } from "../hooks/game";
import { useEffect, useState } from "react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Confetti from "react-confetti";
import { useWindowSize } from "../hooks/useWindowSize";

const FIB = ["1", "2", "3", "5", "8", "13", "", "🤷", ""];

const Room: NextPage = () => {
  const { data: sessionData } = useSession();
  const { query } = useRouter();
  const { onlineUsers, estimates, gameState, submit, emitClear, confetti } =
    useEstimationChannel();
  const [waitingForUsers, setWaitingForUsers] = useState<string[]>([]);
  const { width, height } = useWindowSize();
  const room = query.room;

  useEffect(() => {
    const s = new Set(onlineUsers.map((u) => u.user));
    estimates.forEach((e) => s.delete(e.user.user));
    setWaitingForUsers(Array.from(s));
  }, [onlineUsers, estimates]);

  function estimateClicked(estimate: string) {
    const user: User = {
      user: sessionData?.user?.name || "Anonymous",
      image: sessionData?.user?.image || "",
    };

    submit({ user, value: estimate });
  }

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={confetti}
        className={confetti ? "" : "invisible"}
        suppressHydrationWarning
      />
      <Link href={"/"} className="absolute bottom-4 mx-auto">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Home
        </button>
      </Link>
      <span className="absolute left-2 top-2">
        {Array.from(onlineUsers).map((user, i) => (
          <img
            alt="User profile image"
            key={i}
            src={user.image}
            className={
              sessionData?.user?.name === user.user
                ? " m-1 h-8 rounded-full border-2 border-yellow-500 drop-shadow-2xl"
                : " m-1 h-8 rounded-full drop-shadow-2xl"
            }
            referrerPolicy="no-referrer"
          />
        ))}
      </span>
      <h1 className="py-4 text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>

      {(gameState == GameState.CHOOSING && (
        <div className="m-16 grid grid-cols-3 gap-4">
          {FIB.map((x, i) => (
            <button
              className={
                x === ""
                  ? "invisible"
                  : "rounded-2xl bg-white/10 p-4 text-3xl font-bold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500 sm:p-8 lg:p-12 lg:text-4xl"
              }
              onClick={() => estimateClicked(x)}
              key={i}
            >
              {x}
            </button>
          ))}
        </div>
      )) ||
        (gameState == GameState.SUBMITTED && (
          <>
            <p className="text-center text-2xl text-white">
              Waiting for others...
            </p>
            <table className="m-16 rounded-2xl bg-white/10 text-xl font-semibold text-white">
              <thead>
                <tr>
                  <td className="px-4 py-2">Waiting for:</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {waitingForUsers.map((e, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 font-thin">{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )) ||
        (gameState == GameState.VIEWING && (
          <>
            <ResultsTable data={estimates}></ResultsTable>
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={emitClear}
            >
              New
            </button>
          </>
        ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/auth?room=${ctx.query.room}`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

// noinspection JSUnusedGlobalSymbols
export default Room;
