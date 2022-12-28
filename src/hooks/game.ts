import { useEffect, useState } from "react";
import supabase from "../server/supabase";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { nanoid } from "nanoid";

const ESTIMATE_EVENT = "input";
const CLEAR_EVENT = "clear";
const VIEW_EVENT = "view";

const userId = nanoid();

interface Game {
  myId: string;
  onlineUsers: Map<string, User>;
  estimates: Record<string, UserEstimate>;
  gameState: GameState;
  confetti: boolean;
  submit: (estimate: UserEstimate) => void;
  emitClear: () => void;
  emitContinue: () => void;
}

export function useEstimationChannel(): Game {
  const { data: sessionData, status } = useSession();
  const { query, isReady } = useRouter();
  const [confetti, setConfetti] = useState(false);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [estimates, setEstimates] = useState<Record<string, UserEstimate>>({});

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
        setEstimates({});
        setGameState(GameState.CHOOSING);
      })
      .on("broadcast", { event: VIEW_EVENT }, function () {
        setGameState(GameState.VIEWING);
      });

    realtimeChannel.on("presence", { event: "sync" }, () => {
      const state = realtimeChannel.presenceState();

      if (state[room] !== undefined) {
        // @ts-ignore
        setUsers(new Map(state[room].map((e) => [e.id, e])));
      }
    });

    realtimeChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await realtimeChannel.track({
          user: sessionData?.user?.name,
          image: sessionData?.user?.image,
          id: userId,
        });
      }
    });

    setChannel(realtimeChannel);
  }, [isReady, status]);

  useEffect(() => {
    const estimatesCount = Object.keys(estimates).length;

    if (estimatesCount && estimatesCount >= users.size)
      setGameState(GameState.VIEWING);
  }, [estimates, users]);

  useEffect(() => {
    const estimatesCount = Object.keys(estimates).length;

    if (
      gameState == GameState.CHOOSING ||
      gameState == GameState.SUBMITTED ||
      estimatesCount == 0
    ) {
      setConfetti(false);
      return;
    }

    const arr = Object.values(estimates);
    setConfetti(arr.every((e) => e.value == (arr.at(0)?.value || "null")));
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
    channel
      ?.send({
        type: "broadcast",
        event: CLEAR_EVENT,
      })
      .then(() => {
        setEstimates({});
        setGameState(GameState.CHOOSING);
      });
  }

  function emitContinue() {
    channel
      ?.send({
        type: "broadcast",
        event: VIEW_EVENT,
      })
      .then(() => {
        setGameState(GameState.VIEWING);
      });
  }

  function _addEstimate(estimate: UserEstimate, self: boolean) {
    if (self) setGameState(GameState.SUBMITTED);
    setEstimates((prevState) => ({
      ...prevState,
      [estimate.user.id]: estimate,
    }));
  }

  return {
    myId: userId,
    onlineUsers: users,
    gameState: gameState,
    estimates: estimates,
    submit: submitEstimate,
    emitClear: emitClear,
    emitContinue: emitContinue,
    confetti: confetti,
  };
}
