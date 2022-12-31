import { motion } from "framer-motion";
import type { User, UserEstimate } from "../types/game";
import type { Session } from "next-auth";

const FIB = ["1", "2", "3", "5", "8", "13", "", "🤷", ""];

const EstimateGrid: React.FC<{
  session: Session | null;
  submit: (estimate: UserEstimate) => void;
  myId: string;
}> = ({ session, submit, myId }) => {
  function estimateClicked(estimate: string) {
    const user: User = {
      user: session?.user?.name || "Anonymous",
      image: session?.user?.image || "",
      id: myId,
    };

    submit({ user, value: estimate });
  }

  const buttonStyle = (value: string): string =>
    value === ""
      ? "invisible"
      : "rounded-2xl bg-white/10 p-4 text-3xl font-bold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500 sm:p-8 lg:p-12 lg:text-4xl";

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="m-16 grid grid-cols-3 gap-4"
    >
      {FIB.map((x, i) => (
        <button
          key={i}
          className={buttonStyle(x)}
          onClick={() => estimateClicked(x)}
        >
          {x}
        </button>
      ))}
    </motion.div>
  );
};

export default EstimateGrid;
