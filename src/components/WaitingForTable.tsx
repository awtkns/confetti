import type { Estimates, Users } from "@/types/game";

const WaitingForTable: React.FC<{
  users: Users;
  estimates: Estimates;
  onClick: () => void;
}> = ({ users, estimates, onClick }) => {
  const waitingFor = () => {
    const map = new Map(
      Object.entries(users).filter(([, u]) => u.role == "estimator")
    );

    Object.values(estimates).forEach((e) => map.delete(e.user.id));
    return map.values();
  };

  return (
    <>
      <table className="m-4 rounded-2xl bg-white/10 text-2xl font-semibold text-white">
        <thead>
          <tr>
            <td className="px-4 py-2">Waiting for:</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {Array.from(waitingFor())
            .filter((e) => e.role == "estimator")
            .map((e, i) => (
              <tr key={i}>
                <td className="px-4 py-2 font-thin">{e.user}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        className="rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white no-underline shadow-lg transition hover:bg-white/20 hover:text-yellow-500"
        onClick={onClick}
      >
        View results
      </button>
    </>
  );
};

export default WaitingForTable;
