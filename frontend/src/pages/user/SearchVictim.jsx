import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { searchVictims } from "../../api/victimApi";

const SearchVictim = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await searchVictims(name);
      setResults(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to search right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Search for a victim
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter a full name or part of a name to locate victim records.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              className="input mb-0"
              placeholder="Search by name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn btn-primary whitespace-nowrap"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((victim) => (
            <Link
              key={victim._id}
              to={`/victim/${victim._id}`}
              className="block rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {victim.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {victim.gender}, {victim.age} years old
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{victim.address}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  View Details
                </span>
              </div>
            </Link>
          ))}

          {!loading && results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Search results will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchVictim;
