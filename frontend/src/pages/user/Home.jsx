import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-500 via-sky-600 to-slate-900 p-8 shadow-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-100">
              Disaster Management Platform
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Two clear portals, one relief management system.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-cyan-50/90 sm:text-lg">
              Users can only search victims by name and donate to the
              government. Admins can add victims, search records, and manage
              every database table.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-cyan-50"
              >
                Create Account
              </Link>
              <Link
                to="/user/login"
                className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                User Login
              </Link>
              <Link
                to="/admin/login"
                className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Admin Login
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                User Portal
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                Search and donate only
              </h2>
              <p className="mt-3 text-sm text-slate-200">
                After user login, only two actions are available: search victim
                records by name and donate to the government relief program.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-700">
                Admin Portal
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>`@gov.in` accounts can log in as admins.</li>
                <li>Admins can add victims and search records.</li>
                <li>Admins can view and edit database tables in table format.</li>
              </ul>
              <Link
                to="/admin/login"
                className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
              >
                Open Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
