import axios from "./axios";

export const addVictim = (data) => axios.post("/victims", data);

export const getVictims = () => axios.get("/victims");

export const searchVictims = (name) =>
  axios.get(`/victims/search?name=${name}`);

export const getVictimById = (id) => axios.get(`/victims/${id}`);
