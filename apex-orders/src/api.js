import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  // No API key needed here! The proxy adds it.
});

export default api;
