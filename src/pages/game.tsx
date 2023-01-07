import DynamicConfetti from "components/DynamicConfetti";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { FaEye, FaGamepad, FaShare } from "react-icons/fa";

import type { User, UserRole } from "@/types/game";

import Button from "@/ui/button";
import PopIn from "@/ui/popin";
import Toast from "@/ui/toast";

import { useEstimationChannel } from "@/hooks/useGameChannel";

import EstimateGrid from "@/components/EstimateGrid";
import OnlineUsers from "@/components/OnlineUsers";
import ResultsTable from "@/components/ResultsTable";

import { env } from "../env/client.mjs";

const Game: NextPage = () => {
  const {
    onlineUsers,
    estimates,
    gameState,
    submit,
    emitRole,
    emitClear,
    emitContinue,
    confetti,
    myUser,
    room,
  } = useEstimationChannel();

  const [waitingForUsers, setWaitingForUsers] = useState<Map<string, User>>(
    new Map()
  );
  const [isToastOpen, setToastOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setToastOpen(true);
      setLoading(false);
    }, 750);
  }, []);

  useEffect(() => {
    const s = new Map(
      Object.entries(onlineUsers).filter(([, u]) => u.role == "estimator")
    );
    Object.values(estimates).forEach((e) => s.delete(e.user.id));
    setWaitingForUsers(s);
  }, [onlineUsers, estimates]);

  const choosing = gameState == "choosing" && myUser?.role == "estimator" && (
    <EstimateGrid submit={submit} key="choosing" />
  );

  const waiting = (gameState == "submitted" ||
    (gameState == "choosing" && myUser?.role == "spectator")) && (
    <PopIn className="flex flex-col items-center z-10" key="waiting">
      <table className="m-4 rounded-2xl bg-white/10 text-2xl font-semibold text-white">
        <thead>
          <tr>
            <td className="px-4 py-2">Waiting for:</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {Array.from(waitingForUsers.values())
            .filter((e) => e.role == "estimator")
            .map((e, i) => (
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
  const viewing = gameState == "viewing" && (
    <PopIn className="flex flex-col items-center z-10" key="viewing">
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

  const otherRole = oppositeRole(myUser);

  return (
    <>
      <DynamicConfetti show={confetti} />
      <Toast
        model={[isToastOpen, setToastOpen]}
        onAction={() => {
          window.navigator.clipboard
            .writeText(roomUri(room))
            .then(() => setShowCopied(true));
        }}
        title="Invite link available! 🎉"
        description={roomUri(room)}
      />
      <Toast
        model={[showCopied, setShowCopied]}
        title="Invite link copied! 😎"
      />

      <OnlineUsers
        estimates={estimates}
        users={onlineUsers}
        myId={myUser?.id}
        className="fixed left-2 top-2 z-10"
      />
      <h1 className="mt-16 py-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-xl sm:text-[5rem] z-10">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white z-10">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>
      <AnimatePresence mode="wait">
        {choosing || waiting || viewing}
      </AnimatePresence>
      <div className="flex flex-col bottom-4 absolute items-center z-10 gap-4 ">
        <AnimatePresence>
          {isLoading || isToastOpen || showCopied || (
            <PopIn>
              <Button
                icon={<FaShare />}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20"
                onClick={() => setToastOpen(true)}
              >
                Invite
              </Button>
            </PopIn>
          )}
        </AnimatePresence>
        <PopIn>
          <Button
            icon={otherRole.icon}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20"
            onClick={() => emitRole(otherRole.role)}
          >
            {otherRole.text}
          </Button>
        </PopIn>
      </div>
    </>
  );
};

const oppositeRole: (user?: User) => {
  role: UserRole;
  text: string;
  icon: React.ReactNode;
} = (user) =>
  user?.role === "spectator"
    ? { text: "Estimate", role: "estimator", icon: <FaGamepad /> }
    : { text: "Spectate", role: "spectator", icon: <FaEye /> };

const roomUri = (room: string | undefined) => {
  return encodeURI(env.NEXT_PUBLIC_VERCEL_URL + "/" + room);
};

export default Game;
