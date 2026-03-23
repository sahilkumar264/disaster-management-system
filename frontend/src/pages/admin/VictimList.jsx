import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { getVictims, searchVictims } from "../../api/victimApi";

const VictimList = () => {
  const navigate = useNavigate();
  const [victims, setVictims] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVictims = async () => {
      try {
        setLoading(true);
        const res = await getVictims();
        setVictims(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load victims");
      } finally {
        setLoading(false);
      }
    };

    fetchVictims();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        if (!search) {
          const res = await getVictims();
          setVictims(res.data);
        } else {
          const res = await searchVictims(search);
          setVictims(res.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Victims</h1>

      <input
        className="input mb-4 w-64"
        placeholder="Search victims..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <Loader />
      ) : victims.length === 0 ? (
        <p className="text-gray-500">No victims found</p>
      ) : (
        <div className="overflow-hidden rounded bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Age</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Address</th>
              </tr>
            </thead>

            <tbody>
              {victims.map((victim) => (
                <tr
                  key={victim._id}
                  className="cursor-pointer border-t hover:bg-gray-50"
                  onClick={() => navigate(`/victim/${victim._id}`)}
                >
                  <td className="p-3">
                    {victim.imageUrl ? (
                      <img
                        src={victim.imageUrl}
                        alt={victim.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-[10px] font-semibold uppercase text-slate-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{victim.name}</td>
                  <td className="p-3">{victim.age}</td>
                  <td className="p-3">{victim.gender}</td>
                  <td className="p-3">{victim.contactNo}</td>
                  <td className="p-3">{victim.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VictimList;
