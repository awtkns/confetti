import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { FaEye, FaGamepad, FaShare } from "react-icons/fa";

import type { User, UserRole } from "@/types/game";

import Button from "@/ui/button";
import PopIn from "@/ui/popin";
import Toast from "@/ui/toast";

import { useEstimationChannel } from "@/hooks/useGameChannel";

import DynamicConfetti from "@/components/DynamicConfetti";
import EstimateGrid from "@/components/EstimateGrid";
import OnlineUsers from "@/components/OnlineUsers";
import ResultsTable from "@/components/ResultsTable";
import WaitingForTable from "@/components/WaitingForTable";

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
    myUser,
    room,
  } = useEstimationChannel();

  const [isToastOpen, setToastOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  const tShirt = room !== undefined && room.toLocaleLowerCase().endsWith("-tshirt");

  useEffect(() => {
    const t = setTimeout(() => {
      setToastOpen(true);
      setLoading(false);
    }, 750);

    return () => clearTimeout(t);
  }, []);

  const showConfetti = () => {
    const estimatesArray = Object.values(estimates);
    const usersCount = Object.values(onlineUsers).filter(
      (e) => e.role == "estimator"
    ).length;

    if (
      gameState == "choosing" ||
      gameState == "submitted" ||
      estimatesArray.length != usersCount ||
      estimatesArray.length == 0
    ) {
      return false;
    }

    return estimatesArray.every(
      (e) =>
        e.user.role == "spectator" ||
        e.value == (estimatesArray.at(0)?.value || "null")
    );
  };

  const choosing = gameState == "choosing" && myUser?.role == "estimator" && (
    <EstimateGrid submit={submit} key="choosing" teeSize={tShirt} />
  );

  const waiting = (gameState == "submitted" ||
    (gameState == "choosing" && myUser?.role == "spectator")) && (
    <PopIn className="flex flex-col items-center z-10" key="waiting">
      <WaitingForTable
        users={onlineUsers}
        estimates={estimates}
        onClick={emitContinue}
      />
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
      <DynamicConfetti show={showConfetti()} />
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
      <h1 className="sm:py-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-xl sm:text-[5rem] z-10">
        Estimating
      </h1>
      <p className="text-center text-xl sm:text-2xl text-white z-10">
        Room: <span className="text-yellow-500">{room || ""}</span>
      </p>
      <AnimatePresence mode="wait">
        {choosing || waiting || viewing}
      </AnimatePresence>
      <div className="flex flex-col items-center z-10 gap-2 sm:gap-4 mb-4 mt-auto">
        <AnimatePresence>
          {isLoading || isToastOpen || showCopied || (
            <PopIn>
              <Button
                icon={<FaShare />}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20 "
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
