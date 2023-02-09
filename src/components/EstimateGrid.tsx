import cx from "classnames";

import PopIn from "../ui/popin";

const FIB = ["1", "2", "3", "5", "8", "13", "", "🤷", ""];
const TEE = ["XS", "S", "M", "L", "XL", "XXL", "", "🤷", ""]

const EstimateGrid: React.FC<{
  submit: (estimate: string) => void;
  teeSize?: boolean;
}> = ({ submit, teeSize }) => {
  const hidden = (key: number) => <div key={key} className="invisible"></div>;
  const button = (key: number, value: string) => (
    <button
      key={key}
      onClick={() => submit(value)}
      className={cx(
        "rounded-2xl bg-white/10 shadow-lg transition aspect-square",
        "py-2 sm:p-12",
        "hover:bg-white/20 hover:text-yellow-500",
        "font-bold text-white no-underline text-4xl"
      )}
    >
      {value}
    </button>
  );

  const values = teeSize ? TEE : FIB;

  return (
    <PopIn className="my-4 grid grid-cols-3 gap-2 sm:gap-4 w-full sm:w-auto px-4">
      {values.map((value, key) =>
        value === "" ? hidden(key) : button(key, value)
      )}
    </PopIn>
  );
};

export default EstimateGrid;
