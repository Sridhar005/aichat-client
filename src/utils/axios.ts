import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: API_BASE_URL, // your backend
  withCredentials: true, // only if using cookies
});

