import dynamic from "next/dynamic";
import { useEffect } from "react";
import useSound from "use-sound";

interface Props {
  show: boolean;
}

const Confetti = dynamic<Props>(() => import("./Confetti"), {
  ssr: false,
});

export default function DynamicConfetti(props: Props & { sound?: boolean }) {
  const [play] = useSound("./yay.wav", { volume: 0.25 });

  useEffect(() => {
    if (props.show && props.sound) {
      play();
    }
  }, [play, props]);

  return <Confetti show={props.show} />;
}