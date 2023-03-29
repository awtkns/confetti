import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
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
  Legend
);

const Dash: NextPage = () => {
  useAuthedOnly((router) => router.push("/auth"));

  const { data } = trpc.stats.get.useQuery();

  return (
    <div className="flex flex-col items-center px-4 sm:p-16 rounded-2xl gap-4">
      <Bar
        data={{
          labels: data?.estimates.map((e) => e.value) ?? [],
          datasets: [
            {
              label: "Fibonacci",
              data: data?.estimates.map((e) => e._count.value) ?? [],
              backgroundColor: "hsl(252, 82.9%, 67.8%)",
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "All estimates",
              padding: {
                top: 10,
                bottom: 30,
              },
            },
          },
        }}
        className="bg-white rounded-2xl text-white p-2"
      />
      <Stat
        title="Total Estimates"
        value={data?.estimates.reduce((acc, e) => acc + e._count.value, 0) ?? 0}
      />
      <Stat title="Total Users" value={data?.users ?? 0} />
    </div>
  );
};

const Stat = ({ title, value }: { title: string; value: number }) => (
  <div className="rounded-lg shadow-sm">
    <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
      <div className="px-3 pt-8 pb-10 text-center relative z-10">
        <h4 className="text-sm uppercase text-gray-500 leading-tight">
          {title}
        </h4>
        <h3 className="text-3xl text-gray-700 font-semibold leading-tight mt-3">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

// noinspection JSUnusedGlobalSymbols
export default Dash;
