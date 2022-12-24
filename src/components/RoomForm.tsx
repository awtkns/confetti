import { useState } from "react";
import { useRouter } from "next/router";

const RoomForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  return (
    <div>
      <input
        className="basis-1/2 rounded-full py-1 px-2 no-underline"
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
        className="ml-2 rounded-full bg-white/10 px-2 py-1 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
        onClick={(e) => {
          e.preventDefault();
          router.push(roomId);
        }}
      >
        Go
      </button>
    </div>
  );
};

export default RoomForm;
