import type { User, UserEstimate } from "../types/game";
import { useEffect, useState } from "react";

const ResultsTable: React.FC<{
  estimates: Record<string, UserEstimate>;
  onlineUsers: Record<string, User>;
  className?: string;
}> = ({ estimates, onlineUsers, className }) => {
  const [results, setResults] = useState<Map<string, UserEstimate>>(new Map());

  useEffect(() => {
    const copy = new Map(Object.entries(estimates));

    Object.entries(onlineUsers).forEach(([id, u]) => {
      if (!copy.has(id))
        copy.set(id, {
          value: "😴",
          user: u,
        });
    });

    setResults(copy);
  }, [estimates, onlineUsers]);

  return (
    <table className={className}>
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
