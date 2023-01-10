import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import DynamicConfetti from "../components/DynamicConfetti";
import RoomForm from "../components/RoomForm";

const FIB = ["1", "2", "3", "5", "8", "3"];

const Home: NextPage = () => {
  const [fib, setFib] = useState("3");

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
    <div className="container flex flex-col items-center px-4 sm:p-16">
      <DynamicConfetti show={true} />
      <h1 className="z-10 text-[4rem] font-extrabold tracking-tight text-white drop-shadow-xl sm:text-[8rem]">
        Conf
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
        tti
      </h1>
      <p className="text-white text-xl sm:text-2xl text-center rounded-3xl font-light mb-12">
        🎉 Get your estimation party started with confetti! 🎉
      </p>
      <div className="z-10 flex flex-col items-center gap-2 drop-shadow-xl">
        <RoomForm />
      </div>
    </div>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Home;
