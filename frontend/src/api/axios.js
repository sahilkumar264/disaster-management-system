import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://127.0.0.1:5000/api" : "/api"),
  timeout: 15000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default instance;
