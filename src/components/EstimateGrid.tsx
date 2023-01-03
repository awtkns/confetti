import type { User, UserEstimate } from "../types/game";
import type { Session } from "next-auth";
import PopIn from "../ui/popin";

const FIB = ["1", "2", "3", "5", "8", "13", "", "🤷", " "];

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

  const hidden = (key: number) => <div key={key} className="invisible"></div>;
  const button = (key: number, value: string) => (
    <button
      key={key}
      onClick={() => estimateClicked(value)}
      className="rounded-2xl bg-white/10 p-8 text-3xl font-bold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500 sm:p-12 sm:text-4xl"
    >
      {value}
    </button>
  );

  return (
    <PopIn className="m-4 grid grid-cols-3 gap-4">
      {FIB.map((value, key) =>
        value.trim() === "" ? hidden(key) : button(key, value)
      )}
    </PopIn>
  );
};

export default EstimateGrid;
