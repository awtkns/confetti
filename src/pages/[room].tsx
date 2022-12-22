import { NextPage } from "next";
import { useRouter } from "next/router";
import supabase from "../server/supabase";
import { useSession } from "next-auth/react";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { useEffect, useState } from "react";

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

  const room = query.room;

  useEffect(() => {
    if (!isReady) return;
    if (status !== "authenticated") return;
    if (channel) return;

    let room = typeof query.room === "string" ? query.room : "";

    let c = supabase
      .channel(room, {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: room },
        },
      })
      .on("broadcast", { event: "input" }, ({ payload }) => {
        console.log(payload);
      });

    c.on("presence", { event: "sync" }, () => {
      let state = c.presenceState();
      console.log("presence sync", state);

      // @ts-ignore
      if (state[room] != undefined) setUsers(state[room]);
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
  }, [isReady, status]);

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
      <span className="absolute left-2 top-2">
        {users.map((user, i) => (
          <img
            key={i}
            src={user.image}
            className="m-1 h-8 rounded-full drop-shadow-2xl"
          ></img>
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
