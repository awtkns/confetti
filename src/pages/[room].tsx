import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import Link from "next/link";
import ResultsTable from "../components/ResultsTable";
import type { User } from "../types/game";
import { GameState } from "../types/game";
import { useEstimationChannel } from "../hooks/game";

const FIB = [1, 2, 3, 5, 8, 13];

const Room: NextPage = () => {
  const { data: sessionData } = useSession();
  const { query } = useRouter();
  const { onlineUsers, estimates, gameState, submit, emitClear } =
    useEstimationChannel();
  const room = query.room;

  function estimateClicked(estimate: number) {
    const user: User = {
      user: sessionData?.user?.name || "Anonymous",
      image: sessionData?.user?.image || "none",
    };

    submit({ user, value: estimate });
  }

  return (
    <>
      <Link href={"/"} className="absolute right-2 top-2">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Home
        </button>
      </Link>
      <span className="absolute left-2 top-2">
        {onlineUsers.map((user, i) => (
          <img
            alt="User profile image"
            key={i}
            src={user.image}
            className={
              sessionData?.user?.name === user.user
                ? " m-1 h-8 rounded-full border-2 border-amber-500 drop-shadow-2xl"
                : " m-1 h-8 rounded-full drop-shadow-2xl"
            }
            referrerPolicy="no-referrer"
          />
        ))}
      </span>
      <h1 className="text-[5rem] font-extrabold tracking-tight text-white">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">Room: {room}</p>

      {(gameState == GameState.CHOOSING && (
        <div className="m-16 grid grid-cols-3 gap-4">
          {FIB.map((x, i) => (
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => estimateClicked(x)}
              key={i}
            >
              {x}
            </button>
          ))}
        </div>
      )) ||
        (gameState == GameState.SUBMITTED && (
          <p className="text-center text-2xl text-white">
            Waiting for others...
          </p>
        )) ||
        (gameState == GameState.VIEWING && (
          <ResultsTable data={estimates}></ResultsTable>
        ))}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={emitClear}
      >
        Clear
      </button>
    </>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Room;
