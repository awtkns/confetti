import type { NextPage } from "next";
import { useRouter } from "next/router";
import supabase from "../server/supabase";
import { useSession } from "next-auth/react";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResultsTable from "../components/ResultsTable";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";

const FIB = [1, 2, 3, 5, 8, 13];
const ESTIMATE_EVENT = "input";
const CLEAR_EVENT = "clear";

const Room: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const { query, isReady } = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [estimates, setEstimates] = useState<UserEstimate[]>([]);

  const room = query.room;

  useEffect(() => {
    if (!isReady) return;
    if (status !== "authenticated") return;
    if (channel) return;

    const room = typeof query.room === "string" ? query.room : "";

    const c = supabase
      .channel(room, {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: room },
        },
      })
      .on("broadcast", { event: ESTIMATE_EVENT }, ({ payload }) => {
        console.log("RECIEVD", payload);
        setEstimates((prevState) => [
          ...prevState,
          {
            user: payload.user,
            value: payload.value,
          },
        ]);
      })
      .on("broadcast", { event: CLEAR_EVENT }, function () {
        console.log("CLEAR");
        setEstimates([]);
        setGameState(GameState.CHOOSING);
      });

    c.on("presence", { event: "sync" }, () => {
      const state = c.presenceState();
      console.log("presence sync", state);

      if (state[room] !== undefined) {
        // @ts-ignore
        setUsers(state[room]);
      }
    });

    c.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await c.track({
          user: sessionData?.user?.name,
          image: sessionData?.user?.image,
        });
      }
    });

    setChannel(c);
  }, [
    channel,
    isReady,
    query.room,
    sessionData?.user?.image,
    sessionData?.user?.name,
    status,
  ]);

  useEffect(() => {
    if (estimates.length >= users.length) setGameState(GameState.VIEWING);
  }, [estimates, users]);

  function estimateClicked(estimate: number) {
    console.log("ESTIMATE CLICKED", estimate);

    const user: User = {
      user: sessionData?.user?.name || "Anonymous",
      image: sessionData?.user?.image || "none",
    };

    channel
      ?.send({
        type: "broadcast",
        event: ESTIMATE_EVENT,
        payload: { value: estimate, user: user },
      })
      .then(() => {
        console.log("HEREE", estimate);
        setEstimates((prevState) => [
          ...prevState,
          {
            user: user,
            value: estimate,
          },
        ]);
      });

    setGameState(GameState.SUBMITTED);
  }

  function emitClear() {
    setGameState(GameState.CHOOSING);
    channel
      ?.send({
        type: "broadcast",
        event: CLEAR_EVENT,
      })
      .then(() => {
        setEstimates([]);
        setGameState(GameState.CHOOSING);
      });
  }

  return (
    <>
      <Link href={"/"} className="absolute right-2 top-2">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Home
        </button>
      </Link>
      <span className="absolute left-2 top-2">
        {users.map((user, i) => (
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
