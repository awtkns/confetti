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
import PopIn from "../ui/popin";
import OnlineUsers from "../components/OnlineUsers";

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
    <EstimateGrid session={sessionData} submit={submit} myId={myId} />
  );

  const waiting = gameState == GameState.SUBMITTED && (
    <PopIn className="flex flex-col items-center">
      <table className="m-4 rounded-2xl bg-white/10 text-2xl font-semibold text-white">
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
    </PopIn>
  );
  const viewing = gameState == GameState.VIEWING && (
    <PopIn className="flex flex-col items-center">
      <ResultsTable
        estimates={estimates}
        onlineUsers={onlineUsers}
        className="m-4 rounded-2xl bg-white/10 text-2xl font-semibold text-white"
      />
      <button
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={emitClear}
      >
        New
      </button>
    </PopIn>
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
      <OnlineUsers
        users={onlineUsers}
        myId={myId}
        className="absolute left-2 top-2"
      />
      <h1 className=" mt-16 py-4 text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>
      <AnimatePresence>{choosing || waiting || viewing}</AnimatePresence>
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

export default Room;
