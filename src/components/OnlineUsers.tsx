import { AnimatePresence, motion } from "framer-motion";

import type { User, UserEstimate } from "@/types/game";

const OnlineUsers: React.FC<{
  myId?: string;
  users: Record<string, User>;
  estimates: Record<string, UserEstimate>;
  className?: string;
}> = ({ estimates, users, className, myId }) => {
  const spectatorBadge = (user: User) =>
    user.role === "spectator" && (
      <span className="absolute top-5 left-5 text-xs">👀</span>
    );

  const hasEstimatedBadge = (user: User) =>
    estimates[user.id] && (
      <span className="absolute top-5 left-5 text-xs">✅</span>
    );

  return (
    <div className={className + " flex flex-col gap-2"}>
      <AnimatePresence>
        {Object.values(users)
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((user, i) => (
            <motion.div
              key={i}
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              exit={{ x: -50 }}
              className="relative"
            >
              {spectatorBadge(user) || hasEstimatedBadge(user)}
              <img
                src={user.image}
                alt="User profile image"
                referrerPolicy="no-referrer"
                className={`h-8 rounded-full rounded-full shadow-lg bg-slate-800 ${
                  user.id === myId ? "ring-2 ring-pink-500 " : ""
                }`}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default OnlineUsers;
