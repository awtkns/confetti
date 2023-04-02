import { protectedProcedure, router } from "../trpc";
import {z} from "zod";

interface WeeklyStats {
  week: number;
  estimates: bigint;
  users: bigint;
  rounds: bigint;
  channels: bigint;
}

interface UserStat {
    firstName: string;
    avg: number;
    count: number;
    sum: number;
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

  getByRoom: protectedProcedure
      .input(z.string().min(1))
      .query(async ({ ctx, input: roomName }) => {
        const estimates = await ctx.prisma.estimate.groupBy({
          by: ["value", "userId"],
            where: {
                round: {
                    channel: roomName,
                }
            },
          _count: {
            value: true,
          },
        });

        const userStats = await ctx.prisma.$queryRaw<UserStat[]>`
            select
                trim(if(locate(' ', u.name) = 0,
                    u.name,
                    SUBSTR(u.name, 1, locate(' ', u.name)))) as firstName,
                avg(e.value) as avg,
                count(*) as count,
                sum(e.value) as sum
            from EstimateRound er
            join Estimate e on e.roundId = er.id
            join User u on u.id = e.userId
            where er.channel = ${roomName}
            group by firstName`


        return {
          estimates: estimates.sort(
              (a, b) => parseInt(a.value) - parseInt(b.value)
          ),
            userStats: userStats.sort(
                (a, b) => a.avg - b.avg
            )
        }
      })
});
