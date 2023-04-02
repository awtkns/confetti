import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { NextPage } from "next";
import { Bar } from "react-chartjs-2";

import { useAuthedOnly } from "@/hooks/useAuthedOnly";

import { trpc } from "../utils/trpc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const Dash: NextPage = () => {
  useAuthedOnly((router) => router.push("/auth?room=dash"));

  const { data } = trpc.stats.get.useQuery();
  const { data: roomStats } = trpc.stats.getByRoom.useQuery("platform-services");

  return (
    <div className="w-full max-w-screen-md p-4">
      <div className="grid grid-cols-3 gap-4 pb-4">
        <Stat
          title="Total Estimates"
          value={
            data?.estimates.reduce((acc, e) => acc + e._count.value, 0) ?? 0
          }
        />
        <Stat title="Total Rounds" value={data?.rounds ?? 0} />
        <Stat title="Total Users" value={data?.users ?? 0} />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Bar
          data={{
            labels: data?.estimates.map((e) => e.value) ?? [],
            datasets: [
              {
                label: "Estimated Value",
                data: data?.estimates.map((e) => e._count.value) ?? [],
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  text: "Estimates",
                  display: true,
                },
              },
            },
          }}
          className="bg-slate-900 rounded-2xl text-white p-2"
        />
        <Bar
          data={{
            labels: data?.stats.map((e) => Number(e.week)) ?? [],
            datasets: [
              {
                label: "Estimates",
                data: data?.stats.map((e) => Number(e.estimates)) ?? [],
              },
              {
                label: "Rounds",
                data: data?.stats.map((e) => Number(e.rounds)) ?? [],
              },
              {
                label: "Users",
                data: data?.stats.map((e) => Number(e.users)) ?? [],
              },
              {
                label: "Rooms",
                data: data?.stats.map((e) => Number(e.channels)) ?? [],
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  text: "Week",
                  display: true,
                },
              },
            },
          }}
          className="bg-slate-900 rounded-2xl text-white p-2"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 py-4">
        {roomStats?.userStats.map(e => <Stat
            key={e.firstName}
            title={e.firstName}
            value={e.avg.toFixed(2)}
            info={e.count + " total"}
        />)}
      </div>
    </div>
  );
};

const Stat = ({ title, value, info }: { title: string; value: string | number; info?: string }) => (
  <div className="rounded-lg shadow-sm">
    <div className="rounded-lg bg-slate-900 shadow-lg md:shadow-xl relative overflow-hidden">
      <div className="px-3 pt-8 pb-10 text-center relative z-10">
        <h4 className="text-sm uppercase text-gray-500 leading-tight">
          {title}
        </h4>
        <h3 className="text-3xl text-gray-200 font-semibold leading-tight mt-3">
          {value}
        </h3>
        <h3 className="text-sm uppercase text-gray-700 leading-tight pt-2">
          {info}
        </h3>
      </div>
    </div>
  </div>
);

// noinspection JSUnusedGlobalSymbols
export default Dash;
