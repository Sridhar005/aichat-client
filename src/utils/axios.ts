import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7074", // your backend
  withCredentials: true, // only if using cookies
});

