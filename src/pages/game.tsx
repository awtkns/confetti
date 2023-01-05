import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { FaShare } from "react-icons/fa";

import EstimateGrid from "../components/EstimateGrid";
import OnlineUsers from "../components/OnlineUsers";
import ResultsTable from "../components/ResultsTable";
import { useEstimationChannel } from "../hooks/game";
import { useWindowSize } from "../hooks/useWindowSize";
import type { User } from "../types/game";
import { GameState } from "../types/game";
import Button from "../ui/button";
import PopIn from "../ui/popin";
import Toast from "../ui/toast";

const Game: NextPage = () => {
  const { data: session } = useSession();
  const {
    onlineUsers,
    estimates,
    gameState,
    submit,
    emitClear,
    emitContinue,
    confetti,
    myId,
    room,
  } = useEstimationChannel();
  const [waitingForUsers, setWaitingForUsers] = useState<Map<string, User>>(
    new Map()
  );
  const [isToastOpen, setToastOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setTimeout(() => {
      setToastOpen(true);
      setLoading(false);
    }, 750);
  }, []);

  useEffect(() => {
    const s = new Map(Object.entries(onlineUsers));
    Object.values(estimates).forEach((e) => s.delete(e.user.id));
    setWaitingForUsers(s);
  }, [onlineUsers, estimates]);

  const choosing = gameState == GameState.CHOOSING && (
    <EstimateGrid
      session={session}
      submit={submit}
      myId={myId}
      key="choosing"
    />
  );

  const waiting = gameState == GameState.SUBMITTED && (
    <PopIn className="flex flex-col items-center" key="waiting">
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
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500"
        onClick={emitContinue}
      >
        View results
      </button>
    </PopIn>
  );
  const viewing = gameState == GameState.VIEWING && (
    <PopIn className="flex flex-col items-center" key="viewing">
      <ResultsTable
        estimates={estimates}
        onlineUsers={onlineUsers}
        className="m-4 rounded-2xl bg-white/10 text-2xl font-semibold text-white shadow-lg"
      />
      <button
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500"
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
      <Toast
        model={[isToastOpen, setToastOpen]}
        onAction={() => {
          // window.navigator.clipboard
          //   .writeText(encodeURI(host + "/" + room))
          //   .then(() => setShowCopied(true));
        }}
        title="Invite link available! 🎉"
        // description={encodeURI(host + "/" + room)}
      />
      <Toast
        model={[showCopied, setShowCopied]}
        title="Invite link copied! 😎"
      />

      <OnlineUsers
        users={onlineUsers}
        myId={myId}
        className="absolute left-2 top-2"
      />
      <h1 className=" mt-16 py-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-xl sm:text-[5rem]">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>
      <AnimatePresence mode="wait">
        {choosing || waiting || viewing}
      </AnimatePresence>
      <AnimatePresence>
        {isLoading || isToastOpen || showCopied || (
          <PopIn className="absolute bottom-4 mx-auto flex">
            <Button
              icon={<FaShare />}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500"
              onClick={() => setToastOpen(true)}
            >
              Invite
            </Button>
          </PopIn>
        )}
      </AnimatePresence>
    </>
  );
};

export default Game;
