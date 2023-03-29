import { gameRouter } from "@/server/trpc/router/game";

import { router } from "../trpc";
import { authRouter } from "./auth";
import { statsRouter } from "./stats";


export const appRouter = router({
  auth: authRouter,
  game: gameRouter,
  stats: statsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;