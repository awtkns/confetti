import type { NextPage } from "next";

import { useEffect, useState } from "react";
import supabase from "../server/supabase";
import RoomForm from "../components/RoomForm";
import Confetti from "react-confetti";
import { useWindowSize } from "../hooks/useWindowSize";

const FIB = [1, 2, 3, 5, 8, 13];
const FIB_EVENT = "fib";

const Home: NextPage = () => {
  const [fib, setFib] = useState(8);
  const { width, height } = useWindowSize();

  const channel = supabase
    .channel("index", {
      config: {
        broadcast: { self: false, ack: true },
      },
    })
    .on("broadcast", { event: FIB_EVENT }, ({ payload }) => {
      setFib(payload.value);
    })
    .subscribe();

  function handleClick() {
    const s = new Set(FIB);

    s.delete(fib);
    const x = Array.from(s)[Math.floor(Math.random() * s.size)] || 0;

    channel
      .send({ type: "broadcast", event: FIB_EVENT, payload: { value: x } })
      .then(() => setFib(x));
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <Confetti width={width} height={height} />
      <h1 className="text-10xl text-[5rem] font-extrabold tracking-tight text-white sm:text-[8rem]">
        Estim
        <span className="text-yellow-400">
          <button onClick={handleClick}>{fib}</button>
        </span>
        r
      </h1>
      <div className="flex flex-col items-center  gap-2 ">
        <RoomForm />
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Home;
