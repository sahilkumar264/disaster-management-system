import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import {
  getVictimTreatmentSuggestion,
  getVictimTreatmentSuggestionHistory,
} from "../../api/adminApi";
import { getVictimById } from "../../api/victimApi";
import Loader from "../../components/ui/Loader";
import useAuth from "../../hooks/useAuth";

const SuggestionCard = ({ entry, heading, compact = false }) => {
  if (!entry) {
    return null;
  }

  return (
    <div className="space-y-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{heading}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Source: {entry.source} | Model: {entry.model}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          <p>Generated: {new Date(entry.generatedAt).toLocaleString()}</p>
          {entry.generatedByEmail && <p>Admin: {entry.generatedByEmail}</p>}
        </div>
      </div>

      {entry.note && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          Fallback note: {entry.note}
        </p>
      )}

      <div>
        <h4 className="text-base font-semibold text-slate-900">Condition Focus</h4>
        <p className="mt-2 text-sm text-slate-700">
          {entry.suggestion.conditionFocus}
        </p>
      </div>

      <div>
        <h4 className="text-base font-semibold text-slate-900">Summary</h4>
        <p className="mt-2 text-sm text-slate-700">{entry.suggestion.summary}</p>
      </div>

      <div>
        <h4 className="text-base font-semibold text-slate-900">
          Suggested Medicines
        </h4>
        <div className="mt-3 grid gap-3">
          {entry.suggestion.suggestedMedicines.map((item, index) => (
            <div
              key={`${entry._id || entry.generatedAt}-${item.name}-${index}`}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="mt-1 text-sm text-slate-700">{item.purpose}</p>
              <p className="mt-2 text-xs text-amber-700">{item.caution}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`grid gap-5 ${compact ? "" : "md:grid-cols-2"}`}>
        <div>
          <h4 className="text-base font-semibold text-slate-900">Supportive Care</h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {entry.suggestion.supportiveCare.map((item, index) => (
              <li key={`${entry._id || entry.generatedAt}-care-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-base font-semibold text-slate-900">
            Escalation Signals
          </h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {entry.suggestion.escalationSignals.map((item, index) => (
              <li key={`${entry._id || entry.generatedAt}-signal-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
        {entry.suggestion.disclaimer}
      </p>
    </div>
  );
};

const VictimDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [victim, setVictim] = useState(null);
  const [medical, setMedical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState(null);
  const [suggestionHistory, setSuggestionHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [victimRes, medicalRes] = await Promise.all([
          getVictimById(id),
          axios.get(`/medical/${id}`),
        ]);

        setVictim(victimRes.data);
        setMedical(medicalRes.data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (user?.role !== "admin") {
      setSuggestionResult(null);
      setSuggestionHistory([]);
      return;
    }

    const fetchSuggestionHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await getVictimTreatmentSuggestionHistory(id);
        setSuggestionHistory(res.data);
        setSuggestionResult(res.data[0] || null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load previous AI suggestions.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchSuggestionHistory();
  }, [id, user?.role]);

  const handleGenerateSuggestion = async () => {
    try {
      setSuggestionLoading(true);
      const res = await getVictimTreatmentSuggestion(id);
      const latestEntry = res.data.historyEntry;

      setSuggestionResult(latestEntry);
      setSuggestionHistory((current) => [
        latestEntry,
        ...current.filter((entry) => entry._id !== latestEntry._id),
      ]);

      toast.success("Treatment suggestion generated and saved");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to generate suggestion.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!victim) return <p className="p-6">No data found</p>;

  const previousSuggestions = suggestionHistory.filter(
    (entry) => entry._id !== suggestionResult?._id
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[220px_1fr]">
          <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {victim.imageUrl ? (
              <img
                src={victim.imageUrl}
                alt={victim.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-slate-500">
                No image available
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{victim.name}</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p>
                <b>Age:</b> {victim.age}
              </p>
              <p>
                <b>Gender:</b> {victim.gender}
              </p>
              <p>
                <b>Contact:</b> {victim.contactNo}
              </p>
              <p>
                <b>Address:</b> {victim.address}
              </p>
              <p>
                <b>Medical Condition:</b> {victim.medicalCondition || "Not provided"}
              </p>
              <p>
                <b>Shelter:</b> {victim.shelter?.name || "Not assigned yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Medical Record</h2>

          {!medical ? (
            <p className="mt-4 text-sm text-slate-500">No medical record found.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p>
                <b>Disease:</b> {medical.disease || "Not recorded"}
              </p>
              <p>
                <b>Severity:</b> {medical.severity || "Not recorded"}
              </p>
              <p>
                <b>Medication:</b> {medical.medication || "Not recorded"}
              </p>
              <p>
                <b>Doctor:</b> {medical.doctorAssigned || "Not assigned"}
              </p>
              <p>
                <b>Updated:</b>{" "}
                {medical.updatedAt
                  ? new Date(medical.updatedAt).toLocaleString()
                  : "Not recorded"}
              </p>
            </div>
          )}
        </div>

        {user?.role === "admin" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  AI Treatment Suggestion
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Admin-only supportive guidance based on the victim&apos;s
                  medical condition. Every generated suggestion is saved so you
                  can review older recommendations later.
                </p>
              </div>

              <button
                onClick={handleGenerateSuggestion}
                disabled={suggestionLoading}
                className={`rounded-full px-5 py-3 font-semibold text-white transition ${
                  suggestionLoading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {suggestionLoading ? "Generating..." : "Generate Suggestion"}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {historyLoading ? (
                <p className="text-sm text-slate-500">
                  Loading previous AI suggestions...
                </p>
              ) : (
                <>
                  {suggestionResult ? (
                    <SuggestionCard
                      entry={suggestionResult}
                      heading="Latest Saved Suggestion"
                    />
                  ) : (
                    <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                      No AI suggestion has been saved for this victim yet.
                    </p>
                  )}

                  {previousSuggestions.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Previous Suggestions
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Older saved recommendations for this victim.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {previousSuggestions.map((entry, index) => (
                          <SuggestionCard
                            key={entry._id}
                            entry={entry}
                            heading={`Previous Suggestion ${index + 1}`}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VictimDetails;
