import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getAdminTableData,
  getAdminTables,
  updateAdminTableRecord,
} from "../../api/adminApi";

const prettifyValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const DatabaseTables = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await getAdminTables();
        setTables(res.data);

        if (res.data.length > 0) {
          setSelectedTable(res.data[0].key);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load database tables.");
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    if (!selectedTable) {
      return;
    }

    const fetchTableData = async () => {
      try {
        setLoading(true);
        const res = await getAdminTableData(selectedTable);
        setTableData(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load table data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [selectedTable]);

  const openEditor = (record) => {
    const nextValue = { ...record };
    delete nextValue._id;
    delete nextValue.__v;

    setEditingRecord(record);
    setEditorValue(JSON.stringify(nextValue, null, 2));
  };

  const closeEditor = () => {
    setEditingRecord(null);
    setEditorValue("");
  };

  const visibleColumns = useMemo(() => {
    if (!tableData?.columns?.length) {
      return [];
    }

    return tableData.columns.slice(0, 6);
  }, [tableData]);

  const handleSave = async () => {
    if (!editingRecord) {
      return;
    }

    try {
      const payload = JSON.parse(editorValue);
      await updateAdminTableRecord(selectedTable, editingRecord._id, payload);
      toast.success("Record updated successfully");
      closeEditor();

      const res = await getAdminTableData(selectedTable);
      setTableData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update record. Check the JSON format.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database Tables</h1>
        <p className="mt-2 text-sm text-slate-500">
          View every database table in tabular form and edit records as JSON.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <button
            key={table.key}
            onClick={() => setSelectedTable(table.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedTable === table.key
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-700 shadow hover:bg-slate-50"
            }`}
          >
            {table.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading table data...</p>
      ) : tableData ? (
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="border-b bg-slate-50 px-5 py-4">
            <h2 className="text-lg font-semibold">{tableData.label}</h2>
            <p className="text-sm text-slate-500">
              {tableData.records.length} record(s)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  {visibleColumns.map((column) => (
                    <th key={column} className="p-3 font-semibold">
                      {column}
                    </th>
                  ))}
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.records.map((record) => (
                  <tr key={record._id} className="border-t align-top">
                    {visibleColumns.map((column) => (
                      <td key={column} className="max-w-[220px] p-3 text-slate-600">
                        <div className="truncate">{prettifyValue(record[column])}</div>
                      </td>
                    ))}
                    <td className="p-3">
                      <button
                        onClick={() => openEditor(record)}
                        className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {tableData.records.length === 0 && (
                  <tr>
                    <td
                      className="p-6 text-center text-slate-500"
                      colSpan={visibleColumns.length + 1}
                    >
                      No records found in this table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Edit Record</h3>
                <p className="text-sm text-slate-500">
                  Update the JSON and save changes back to the database.
                </p>
              </div>
              <button
                onClick={closeEditor}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <textarea
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              className="h-[360px] w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-full bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseTables;
