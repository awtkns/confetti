import { AnimatePresence, motion } from "framer-motion";
import type { User } from "../types/game";

const OnlineUsers: React.FC<{
  myId: string;
  users: Record<string, User>;
  className?: string;
}> = ({ users, className, myId }) => {
  return (
    <span className={className}>
      <AnimatePresence>
        {Object.values(users).map((user, i) => (
          <motion.img
            key={i}
            src={user.image}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            exit={{ x: -50 }}
            alt="User profile image"
            referrerPolicy="no-referrer"
            className={`m-1 h-8 rounded-full drop-shadow-2xl ${
              user.id === myId ? "ring-2 ring-pink-500 " : ""
            }`}
          />
        ))}
      </AnimatePresence>
    </span>
  );
};

export default OnlineUsers;
