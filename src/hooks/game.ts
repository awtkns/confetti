import { useEffect, useState } from "react";
import supabase from "../server/supabase";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { RealtimeChannel } from "@supabase/realtime-js";

const ESTIMATE_EVENT = "input";
const CLEAR_EVENT = "clear";

interface Game {
  onlineUsers: User[];
  estimates: UserEstimate[];
  gameState: GameState;
  confetti: boolean;
  submit: (estimate: UserEstimate) => void;
  emitClear: () => void;
}

export function useEstimationChannel(): Game {
  const { data: sessionData, status } = useSession();
  const { query, isReady } = useRouter();
  const [confetti, setConfetti] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [estimates, setEstimates] = useState<UserEstimate[]>([]);

  useEffect(() => {
    if (
      !isReady ||
      status !== "authenticated" ||
      channel ||
      typeof query.room !== "string"
    )
      return;

    const room = query.room;
    const realtimeChannel = supabase
      .channel(room, {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: room },
        },
      })
      .on("broadcast", { event: ESTIMATE_EVENT }, ({ payload }) => {
        _addEstimate(payload, false);
      })
      .on("broadcast", { event: CLEAR_EVENT }, function () {
        setEstimates([]);
        setGameState(GameState.CHOOSING);
      });

    realtimeChannel.on("presence", { event: "sync" }, () => {
      const state = realtimeChannel.presenceState();
      console.log("presence sync", state);

      if (state[room] !== undefined) {
        // @ts-ignore
        setUsers(state[room]);
      }
    });

    realtimeChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await realtimeChannel.track({
          user: sessionData?.user?.name,
          image: sessionData?.user?.image,
        });
      }
    });

    setChannel(realtimeChannel);
  }, [isReady, status]);

  useEffect(() => {
    if (estimates.length >= users.length) setGameState(GameState.VIEWING);
  }, [estimates, users]);

  useEffect(() => {
    if (
      gameState == GameState.CHOOSING ||
      gameState == GameState.SUBMITTED ||
      estimates.length == 0
    ) {
      setConfetti(false);
      return;
    }

    console.log(estimates);
    setConfetti(
      estimates.every((e) => e.value == (estimates.at(0)?.value || "null"))
    );
  }, [gameState, estimates]);

  function submitEstimate(estimate: UserEstimate) {
    channel
      ?.send({
        type: "broadcast",
        event: ESTIMATE_EVENT,
        payload: estimate,
      })
      .then(() => _addEstimate(estimate, true));
  }

  function emitClear() {
    setGameState(GameState.CHOOSING);
    channel
      ?.send({
        type: "broadcast",
        event: CLEAR_EVENT,
      })
      .then(() => {
        setEstimates([]);
        setGameState(GameState.CHOOSING);
      });
  }

  function _addEstimate(estimate: UserEstimate, self: boolean) {
    if (self) setGameState(GameState.SUBMITTED);
    setEstimates((prevState) => [...prevState, estimate]);
  }

  return {
    onlineUsers: users,
    gameState: gameState,
    estimates: estimates,
    submit: submitEstimate,
    emitClear: emitClear,
    confetti: confetti,
  };
}
