import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

import RoomForm from "../components/RoomForm";
import { useWindowSize } from "../hooks/useWindowSize";

const FIB = ["1", "2", "3", "5", "8"];

const Home: NextPage = () => {
  const [fib, setFib] = useState("8");
  const { width, height } = useWindowSize();

  useEffect(() => {
    const interval = setInterval(() => handleClick(), 3000);
    return () => clearInterval(interval);
  });

  function handleClick() {
    const s = new Set(FIB);

    s.delete(fib);
    const x = Array.from(s)[Math.floor(Math.random() * s.size)] || "8";
    setFib(x);
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <Confetti width={width} height={height} gravity={0.05} className="z-0" />
      <h1 className="text-10xl z-10 text-[5rem] font-extrabold tracking-tight text-white drop-shadow-xl sm:text-[8rem]">
        Estim
        <AnimatePresence mode="popLayout">
          <motion.span
            className="z-50 inline-block text-center text-yellow-400 sm:min-w-[5rem]"
            onClick={handleClick}
            initial={{ y: -75, scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ y: 75, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25 }}
            key={fib}
          >
            {fib}
          </motion.span>
        </AnimatePresence>
        r
      </h1>
      <div className="z-10 flex flex-col items-center gap-2 drop-shadow-xl">
        <RoomForm />
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Home;
