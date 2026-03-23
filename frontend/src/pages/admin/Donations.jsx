import { useEffect, useState } from "react";
import { getDonations } from "../../api/donationApi";
import toast from "react-hot-toast";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await getDonations();
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Donations</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Donor</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="p-2">{d.donorName}</td>
                <td className="p-2">{d.donorContact}</td>
                <td className="p-2">{d.donationType}</td>
                <td className="p-2">
                  {d.amount || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Donations;