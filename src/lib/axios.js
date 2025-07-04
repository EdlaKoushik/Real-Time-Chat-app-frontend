import axios from "axios";
// Ensure the API URL ends with /api for production
let API_URL = import.meta.env.VITE_API_URL;
if (API_URL && !API_URL.endsWith("/api")) {
  API_URL = API_URL.replace(/\/?$/, "/api");
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
