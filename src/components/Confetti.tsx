import ReactConfetti from "react-confetti";

import { useWindowSize } from "@/hooks/useWindowSize";


const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const { width, height } = useWindowSize();

  return (
    <ReactConfetti
      width={width}
      height={height}
      gravity={0.05}
      recycle={show}
      className={show ? "z-0" : "z-0 invisible"}
    />
  );
};

export default Confetti;