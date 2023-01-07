import PopIn from "../ui/popin";

const FIB = ["1", "2", "3", "5", "8", "13", "", "🤷", ""];

const EstimateGrid: React.FC<{
  submit: (estimate: string) => void;
}> = ({ submit }) => {
  const hidden = (key: number) => <div key={key} className="invisible"></div>;
  const button = (key: number, value: string) => (
    <button
      key={key}
      onClick={() => submit(value)}
      className="rounded-2xl bg-white/10 p-4 sm:p-8 text-xl sm:text-3xl font-bold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500 sm:p-12 sm:text-4xl"
    >
      {value}
    </button>
  );

  return (
    <PopIn className="m-4 grid grid-cols-3 gap-4">
      {FIB.map((value, key) =>
        value === "" ? hidden(key) : button(key, value)
      )}
    </PopIn>
  );
};

export default EstimateGrid;
