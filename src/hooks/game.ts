import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import supabase from "../server/supabase";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { nanoid } from "nanoid";
import { z } from "zod";

const ESTIMATE_EVENT = "input";
const CLEAR_EVENT = "clear";
const VIEW_EVENT = "view";

const userId = nanoid();

const userValidator = z.object({
  id: z.string(),
  user: z.string(),
  image: z.string().url(),
});

const presenceValidator = z.array(userValidator);

type Users = Record<string, User>;
type Estimates = Record<string, UserEstimate>;

interface Game {
  myId: string;
  onlineUsers: Users;
  estimates: Estimates;
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
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [users, setUsers] = useState<Users>({});
  const [estimates, setEstimates] = useState<Estimates>({});

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
        _clearEstimates();
      })
      .on("broadcast", { event: VIEW_EVENT }, function () {
        setGameState(GameState.VIEWING);
      });

    realtimeChannel.on("presence", { event: "sync" }, () => {
      const state = realtimeChannel.presenceState();

      if (state[room] !== undefined) {
        presenceValidator
          .parseAsync(state[room])
          .then((r) => setUsers(Object.fromEntries(r.map((e) => [e.id, e]))));
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
  }, [
    channel,
    isReady,
    query.room,
    sessionData?.user?.image,
    sessionData?.user?.name,
    status,
  ]);

  useEffect(() => {
    _updateGameState(estimates, users, setGameState);
  }, [estimates, users]);

  useEffect(() => {
    const estimatesCount = Object.keys(estimates).length;
    const usersCount = Object.keys(users).length;

    if (
      gameState == GameState.CHOOSING ||
      gameState == GameState.SUBMITTED ||
      estimatesCount != usersCount ||
      estimatesCount == 0
    ) {
      setConfetti(false);
      return;
    }

    const arr = Object.values(estimates);
    setConfetti(arr.every((e) => e.value == (arr.at(0)?.value || "null")));
  }, [gameState, estimates, users]);

  function submitEstimate(estimate: UserEstimate) {
    _addEstimate(estimate, true);
    channel?.send({
      type: "broadcast",
      event: ESTIMATE_EVENT,
      payload: estimate,
    });
  }

  function emitClear() {
    _clearEstimates();
    channel?.send({
      type: "broadcast",
      event: CLEAR_EVENT,
    });
  }

  function emitContinue() {
    setGameState(GameState.VIEWING);
    channel?.send({
      type: "broadcast",
      event: VIEW_EVENT,
    });
  }

  function _clearEstimates() {
    setEstimates({});
    setGameState(GameState.CHOOSING);
  }

  function _addEstimate(estimate: UserEstimate, self: boolean) {
    setEstimates((prevState) => ({
      ...prevState,
      [estimate.user.id]: estimate,
    }));

    if (self) {
      _updateGameState(estimates, users, setGameState);
      if (gameState == GameState.CHOOSING) setGameState(GameState.SUBMITTED);
    }
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

function _updateGameState(
  estimates: Estimates,
  users: Users,
  setGameState: Dispatch<SetStateAction<GameState>>
) {
  const estimatesCount = Object.keys(estimates).length;
  const usersCount = Object.keys(users).length;

  if (estimatesCount && estimatesCount >= usersCount)
    setGameState(GameState.VIEWING);
}
