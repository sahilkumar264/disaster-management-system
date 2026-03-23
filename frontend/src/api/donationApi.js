import axios from "./axios";

export const donate = (data) =>
  axios.post("/donations", data);

export const getDonations = () =>
  axios.get("/donations");

