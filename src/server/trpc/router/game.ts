import { z } from "zod";

import { prisma } from "@/server/db/client";

import { protectedProcedure, router } from "../trpc";

const estimateValidator = z.object({
  value: z.string().max(20),
  channel: z.string().max(255),
  presenceRef: z.string().max(40),
});
export const gameRouter = router({
  saveEstimate: protectedProcedure
    .input(estimateValidator)
    .mutation(async ({ input: estimate, ctx }) => {
      let round = await prisma.estimateRound.findFirst({
        orderBy: { createdAt: "desc" },
      });

      const user = await prisma.user.findFirstOrThrow({
        where: { email: ctx.session?.user?.email },
      });

      const currRoundEstimate = await prisma.estimate.findFirst({
        where: {
          roundId: round?.id,
          userId: user.id,
          presenceRef: estimate.presenceRef,
        },
      });

      if (currRoundEstimate || !round) {
        round = await prisma.estimateRound.create({
          data: {
            channel: estimate.channel,
          },
        });
      }

      await prisma.estimate.create({
        data: {
          userId: user.id,
          value: estimate.value,
          presenceRef: estimate.presenceRef,
          roundId: round.id,
        },
      });
    }),
});
