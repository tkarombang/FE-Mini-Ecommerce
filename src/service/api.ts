import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_MINIECOM_RK || "http://localhost:8000",
  headers: {
    // Perbaikan: "application/json"
    "Content-Type": "application/json",
  },
});
export default api;
