import type { UserEstimate } from "../types/game";

const ResultsTable: React.FC<{ data: UserEstimate[] }> = ({ data }) => {
  return (
    <table className="m-16 rounded-2xl bg-white/10 text-xl font-semibold text-white">
      <thead>
        <tr>
          <td className="px-4 py-2">Results</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {data
          .sort((a, b) => b.value - a.value)
          .map((e, i) => (
            <tr key={i}>
              <td className="pl-4 font-thin ">{e.user.user}</td>
              <td className="px-4 py-2">{e.value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
