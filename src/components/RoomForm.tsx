import { useState } from "react";
import { useRouter } from "next/router";
import { FaArrowRight } from "react-icons/fa";

const RoomForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="rounded-full border-gray-300 py-2 focus:border-yellow-500 focus:ring-yellow-500"
        placeholder="Room to join..."
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            router.push(roomId);
          }
        }}
      ></input>
      <button
        className="ml-2 rounded-full bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={(e) => {
          e.preventDefault();
          router.push(roomId);
        }}
      >
        <FaArrowRight className="h-4 text-inherit " />
      </button>
    </div>
  );
};

export default RoomForm;
