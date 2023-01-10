import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { z } from "zod";

import Input from "../ui/input";
import Loader from "../ui/loader";

const roomValidator = z.string().min(1);

const RoomForm: React.FC = () => {
  const { status } = useSession();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const room = useState("");
  const error = useState(false);

  const joinRoom = () => {
    setLoading(true);

    try {
      let url = roomValidator.parse(room[0]);
      if (status == "unauthenticated") url = "auth?room=" + url;
      router.push(url).then();
    } catch (e) {
      setLoading(false);
      error[1](true);
    }
  };

  return (
    <motion.div
      className="flex items-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.25, type: "spring" }}
    >
      <Input
        type="text"
        className="py-2"
        placeholder="Create a session ..."
        model={room}
        error={error}
        enterPressed={joinRoom}
      ></Input>
      <motion.button
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.25, type: "spring" }}
        className="ml-2 rounded-full bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={(e) => {
          e.preventDefault();
          joinRoom();
        }}
      >
        {loading ? <Loader /> : <FaArrowRight className="h-4 text-inherit " />}
      </motion.button>
    </motion.div>
  );
};

export default RoomForm;
