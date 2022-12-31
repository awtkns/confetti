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
import { AnimatePresence } from "framer-motion";
import EstimateGrid from "../components/EstimateGrid";

const Room: NextPage = () => {
  const { data: sessionData } = useSession();
  const { query } = useRouter();
  const {
    onlineUsers,
    estimates,
    gameState,
    submit,
    emitClear,
    emitContinue,
    confetti,
    myId,
  } = useEstimationChannel();
  const [waitingForUsers, setWaitingForUsers] = useState<Map<string, User>>(
    new Map()
  );
  const { width, height } = useWindowSize();
  const room = query.room;

  useEffect(() => {
    const s = new Map(Object.entries(onlineUsers));
    Object.values(estimates).forEach((e) => s.delete(e.user.id));
    setWaitingForUsers(s);
  }, [onlineUsers, estimates]);

  const choosing = gameState == GameState.CHOOSING && (
    <AnimatePresence>
      <EstimateGrid session={sessionData} submit={submit} myId={myId} />
    </AnimatePresence>
  );
  const waiting = gameState == GameState.SUBMITTED && (
    <>
      <p className="text-center text-2xl text-white">Waiting for others...</p>
      <table className="m-16 rounded-2xl bg-white/10 text-xl font-semibold text-white">
        <thead>
          <tr>
            <td className="px-4 py-2">Waiting for:</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {Array.from(waitingForUsers.values()).map((e, i) => (
            <tr key={i}>
              <td className="px-4 py-2 font-thin">{e.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={emitContinue}
      >
        View results
      </button>
    </>
  );
  const viewing = gameState == GameState.VIEWING && (
    <>
      <ResultsTable
        estimates={estimates}
        onlineUsers={onlineUsers}
      ></ResultsTable>
      <button
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={emitClear}
      >
        New
      </button>
    </>
  );
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
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500">
          Home
        </button>
      </Link>
      <span className="absolute left-2 top-2">
        {Object.values(onlineUsers).map((user, i) => (
          <img
            alt="User profile image"
            key={i}
            src={user.image}
            className={
              user.id === myId
                ? " m-1 h-8 rounded-full border-2 border-yellow-500 drop-shadow-2xl"
                : " m-1 h-8 rounded-full drop-shadow-2xl"
            }
            referrerPolicy="no-referrer"
          />
        ))}
      </span>
      <h1 className=" mt-16 py-4 text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>

      {choosing || waiting || viewing}
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
