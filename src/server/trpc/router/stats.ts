import { protectedProcedure, router } from "../trpc";

interface WeeklyStats {
  week: number;
  estimates: bigint;
  users: bigint;
  rounds: bigint;
  channels: bigint;
}

export const statsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const estimates = await ctx.prisma.estimate.groupBy({
      by: ["value"],
      _count: {
        value: true,
      },
    });

    const weeklyEstimates = await ctx.prisma.$queryRaw<WeeklyStats[]>`
          select 
            week(e.createdAt) as "week", 
            count(e.id) as "estimates", 
            count(distinct e.userId) as 'users', 
            count(distinct e.roundId) as "rounds", 
            count(distinct er.channel) as "channels"
          from Estimate e
          join EstimateRound er on e.roundId = er.id
          group by week(e.createdAt)
          order by "week" asc`;

    return {
      estimates: estimates.sort(
        (a, b) => parseInt(a.value) - parseInt(b.value)
      ),
      rounds: await ctx.prisma.estimateRound.count(),
      users: await ctx.prisma.user.count(),
      stats: weeklyEstimates,
    };
  }),
});
