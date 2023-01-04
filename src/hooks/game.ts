import type { RealtimeChannel } from "@supabase/realtime-js";
import { nanoid } from "nanoid";
import type { Session } from "next-auth";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { subscribe, unsubscribeCallback } from "../server/supabase";
import type { User, UserEstimate } from "../types/game";
import { GameState } from "../types/game";

const ESTIMATE_EVENT = "input";
const CLEAR_EVENT = "clear";
const VIEW_EVENT = "view";
const SYNC_EVENT = "sync";

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
  const channel = useRef<RealtimeChannel>();
  const [confetti, setConfetti] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.CHOOSING);
  const [users, setUsers] = useState<Users>({});
  const [estimates, setEstimates] = useState<Estimates>({});

  useEffect(() => {
    if (channel.current) return unsubscribeCallback(channel.current);

    channel.current = subscribe(channelId);
    channel.current
      .on("broadcast", { event: ESTIMATE_EVENT }, ({ payload }) => {
        _addEstimate(payload, setEstimates);
      })
      .on("broadcast", { event: CLEAR_EVENT }, function () {
        _clearEstimates();
      })
      .on("broadcast", { event: VIEW_EVENT }, function () {
        setGameState(GameState.VIEWING);
      })
      .on("presence", { event: SYNC_EVENT }, () => {
        const state = channel.current?.presenceState();

        if (state && state[channelId] !== undefined) {
          presenceValidator
            .parseAsync(state[channelId])
            .then((r) => setUsers(Object.fromEntries(r.map((e) => [e.id, e]))));
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.current?.track({
            user: session?.user?.name,
            image: session?.user?.image,
            id: userId,
          });
        }
      });

    return unsubscribeCallback(channel.current);
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
    channel.current?.send({
      type: "broadcast",
      event: ESTIMATE_EVENT,
      payload: estimate,
    });
  }

  function emitClear() {
    _clearEstimates();
    channel.current?.send({
      type: "broadcast",
      event: CLEAR_EVENT,
    });
  }

  function emitContinue() {
    setGameState(GameState.VIEWING);
    channel.current?.send({
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
