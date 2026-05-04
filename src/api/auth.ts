import { api } from "../utils/axios";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", {
    fullName,
    email,
    password,
  });

  return res.data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};

export const getMe = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const upgradeToPro = async () => {
  const res = await api.post("/user/upgrade");
  return res.data;
};