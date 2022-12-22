import type { UserEstimate } from "../types/game";

const ResultsTable: React.FC<{ data: UserEstimate[] }> = ({ data }) => {
  return (
    <table className="bg-white/10 font-semibold text-white">
      <thead></thead>
      <tbody>
        {data.map((e, i) => (
          <tr className="m-4" key={i}>
            <td>{e.user.user}</td>
            <td>{e.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
