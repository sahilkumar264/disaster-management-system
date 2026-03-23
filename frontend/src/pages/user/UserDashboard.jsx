import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const UserDashboard = () => {
  const { user, logout } = useAuth();

  const actions = [
    {
      title: "Search Victim By Name",
      description:
        "Search the database for victim records and open the detailed profile.",
      path: "/user/search",
      action: "Open Search",
    },
    {
      title: "Donation To Government",
      description:
        "Submit money, food, or clothing donations to the government relief workflow.",
      path: "/user/donate",
      action: "Donate Now",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-sky-700 via-cyan-600 to-slate-900 p-8 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">
              User Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black">
              Welcome back{user?.email ? `, ${user.email}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-cyan-50/90">
              As a user, you only have two actions here: search victim records
              and donate to the government relief effort.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {actions.map((item) => (
            <div key={item.path} className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-700">
                User Action
              </p>
              <h2 className="mt-3 text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{item.description}</p>
              <Link
                to={item.path}
                className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
