import type { User, UserEstimate } from "../types/game";
import { useEffect, useState } from "react";

const ResultsTable: React.FC<{
  estimates: Record<string, UserEstimate>;
  onlineUsers: Map<string, User>;
}> = ({ estimates, onlineUsers }) => {
  const [results, setResults] = useState<Map<string, UserEstimate>>(new Map());

  useEffect(() => {
    const copy = new Map(Object.entries(estimates));

    onlineUsers.forEach((u, id) => {
      if (!copy.has(id))
        copy.set(id, {
          value: "😴",
          user: u,
        });
    });

    setResults(copy);
  }, [estimates, onlineUsers]);

  return (
    <table className="m-16 rounded-2xl bg-white/10 text-xl font-semibold text-white">
      <thead>
        <tr>
          <td className="px-4 py-2">Results</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {Array.from(results.values())
          .sort((a, b) => parseInt(a.value) - parseInt(b.value))
          .map((e, i) => (
            <tr key={i}>
              <td className="pl-4 font-thin ">{e.user.user}</td>
              <td className="px-4 py-2 text-yellow-500">{e.value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
