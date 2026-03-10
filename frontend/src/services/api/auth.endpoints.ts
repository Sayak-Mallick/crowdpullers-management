import { api } from "../wrapper/fetch.wrapper";

export const register = async (data: { name: string; email: string; password: string }) => {
  return api.post("/api/users/register", data);
};

export const login = async (data: { email: string; password: string }) => {
  return api.post("/api/users/login", data);
};
