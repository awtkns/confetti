import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import supabase from "../server/supabase";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";
import type { RealtimeChannel } from "@supabase/realtime-js";
import { nanoid } from "nanoid";
import { z } from "zod";
import type { Session } from "next-auth";

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

export function useEstimationChannel(
  channelId: string,
  session: Session | null
): Game {
  const [confetti, setConfetti] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [users, setUsers] = useState<Users>({});
  const [estimates, setEstimates] = useState<Estimates>({});

  useEffect(() => {
    const realtimeChannel = supabase
      .channel(channelId, {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: channelId },
        },
      })
      .on("broadcast", { event: ESTIMATE_EVENT }, ({ payload }) => {
        _addEstimate(payload, setEstimates);
      })
      .on("broadcast", { event: CLEAR_EVENT }, function () {
        _clearEstimates();
      })
      .on("broadcast", { event: VIEW_EVENT }, function () {
        setGameState(GameState.VIEWING);
      });

    realtimeChannel.on("presence", { event: "sync" }, () => {
      const state = realtimeChannel.presenceState();

      if (state[channelId] !== undefined) {
        presenceValidator
          .parseAsync(state[channelId])
          .then((r) => setUsers(Object.fromEntries(r.map((e) => [e.id, e]))));
      }
    });

    realtimeChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await realtimeChannel.track({
          user: session?.user?.name,
          image: session?.user?.image,
          id: userId,
        });
      }
    });

    setChannel(realtimeChannel);
    return () => {
      realtimeChannel.unsubscribe().then();
    };
  }, [channelId, session?.user?.image, session?.user?.name]);

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
    _addEstimate(estimate, setEstimates);
    _updateGameState(estimates, users, setGameState);
    if (gameState == GameState.CHOOSING) setGameState(GameState.SUBMITTED);
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

function _addEstimate(
  estimate: UserEstimate,
  setEstimates: Dispatch<SetStateAction<Estimates>>
) {
  setEstimates((prevState) => ({
    ...prevState,
    [estimate.user.id]: estimate,
  }));
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
