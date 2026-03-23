import axios from "./axios";

export const getAdminOverview = () => axios.get("/admin/overview");

export const getAdminTables = () => axios.get("/admin/tables");

export const getAdminTableData = (table) => axios.get(`/admin/tables/${table}`);

export const updateAdminTableRecord = (table, id, payload) =>
  axios.put(`/admin/tables/${table}/${id}`, payload);

export const getVictimTreatmentSuggestionHistory = (victimId) =>
  axios.get(`/admin/victims/${victimId}/treatment-suggestions`);

export const getVictimTreatmentSuggestion = (victimId) =>
  axios.post(`/admin/victims/${victimId}/treatment-suggestion`);
