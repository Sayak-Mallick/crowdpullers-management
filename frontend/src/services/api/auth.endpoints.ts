import { api } from "../wrapper/fetch.wrapper";

export const login = async (data: { email: string; password: string }) => {
  return api.post("/api/users/login", data);
};
