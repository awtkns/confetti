import { gameRouter } from "@/server/trpc/router/game";

import { router } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
