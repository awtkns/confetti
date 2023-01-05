import dynamic from "next/dynamic";

interface Props {
  show: boolean;
}

const Confetti = dynamic<Props>(() => import("./Confetti"), {
  ssr: false,
});

export default function DynamicConfetti(props: Props) {
  return <Confetti show={props.show} />;
}
