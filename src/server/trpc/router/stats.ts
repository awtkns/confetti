import { protectedProcedure, router } from "../trpc";

export const statsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const estimates = await ctx.prisma.estimate.groupBy({
      by: ["value"],
      _count: {
        value: true,
      },
    });

    return {
      estimates: estimates.sort(
        (a, b) => parseInt(a.value) - parseInt(b.value)
      ),
      users: await ctx.prisma.user.count(),
    };
  }),
});