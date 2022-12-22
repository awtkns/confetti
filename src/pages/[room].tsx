import type { NextPage } from "next";
import { useRouter } from "next/router";
import supabase from "../server/supabase";
import { useSession } from "next-auth/react";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FIB = [1, 2, 3, 5, 8, 13];
const ESTIMATE_EVENT = "input";

interface User {
  user: string;
  image: string;
}

const Room: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const { query, isReady } = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [e, setE] = useState<Map<string, number>>(new Map());

  const room = query.room;

  useEffect(() => {
    if (!isReady) return;
    if (status !== "authenticated") return;
    if (channel) return;

    const room = typeof query.room === "string" ? query.room : "";

    const c = supabase
      .channel(room, {
        config: {
          broadcast: { self: true, ack: true },
          presence: { key: room },
        },
      })
      .on("broadcast", { event: "input" }, ({ payload }) => {
        console.log("HERE");
        console.log(payload);
        setE(
          (prevState) => new Map(prevState.set(payload.user, payload.value))
        );
        console.log(payload);
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

  function estimateClicked(estimate: number) {
    if (channel == undefined) return;
    channel
      .send({
        type: "broadcast",
        event: ESTIMATE_EVENT,
        payload: { value: estimate, user: sessionData?.user?.name },
      })
      .then();
  }

  return (
    <>
      <Link href={"/"} className="absolute right-2 top-2">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Home
        </button>
      </Link>
      {JSON.stringify(Object.fromEntries(e))}
      <span className="absolute left-2 top-2">
        {users.map((user, i) => (
          <Image
            alt="User profile image"
            key={i}
            src={user.image}
            className="m-1 h-8 rounded-full drop-shadow-2xl"
            referrerPolicy="no-referrer"
          ></Image>
        ))}
      </span>
      <h1 className="text-[5rem] font-extrabold tracking-tight text-white">
        Estimating
      </h1>
      <p className="text-center text-2xl text-white">Room: {room}</p>
      <div className="m-16 grid grid-cols-3 gap-4">
        {FIB.map((x, i) => (
          <EstimationButton estimate={x} onClick={estimateClicked} key={i} />
        ))}
      </div>
    </>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Room;

const EstimationButton: React.FC<{
  estimate: number;
  onClick: (x: number) => void;
}> = ({ estimate, onClick }) => {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={() => onClick(estimate)}
    >
      {estimate}
    </button>
  );
};
