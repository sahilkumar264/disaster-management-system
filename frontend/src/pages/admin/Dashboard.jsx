import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminOverview } from "../../api/adminApi";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await getAdminOverview();
        setOverview(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard overview.");
      }
    };

    fetchOverview();
  }, []);

  const stats = [
    { title: "Total Users", value: overview?.totals?.users ?? "-" },
    { title: "Total Victims", value: overview?.totals?.victims ?? "-" },
    { title: "Total Donations", value: overview?.totals?.donations ?? "-" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Search victims, add new records, and manage every database table from
          one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg"
          >
            <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500">
              {item.title}
            </h2>
            <p className="mt-3 text-3xl font-black text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">Database Tables</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {overview?.tables?.map((table) => (
            <div
              key={table.key}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">{table.label}</p>
              <p className="mt-2 text-2xl font-black text-sky-700">
                {table.count}
              </p>
            </div>
          )) || <p className="text-sm text-slate-500">Loading tables...</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
