import { useState } from "react";
import { useRouter } from "next/router";
import { FaArrowRight } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { z } from "zod";
import Input from "../ui/input";

const roomValidator = z.string().min(1);

const RoomForm: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();

  const room = useState("");
  const error = useState(false);

  const joinRoom = () => {
    let url = roomValidator.parse(room[0]);
    if (status == "unauthenticated") url = "auth?room=" + url;
    router.push(url).then();
  };

  return (
    <div className="flex items-center">
      <Input
        type="text"
        className="py-2"
        placeholder="Room to join..."
        model={room}
        error={error}
        enterPressed={joinRoom}
      ></Input>
      <button
        className="ml-2 rounded-full bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={(e) => {
          e.preventDefault();
          try {
            joinRoom();
          } catch (e) {
            error[1](true);
          }
        }}
      >
        <FaArrowRight className="h-4 text-inherit " />
      </button>
    </div>
  );
};

export default RoomForm;
