import useTokenStore from "@/store";
import { api } from "../wrapper/fetch.wrapper";

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export const getClients = async () => {
  return api.get("/api/clients");
};

export const createClient = async (data: FormData) => {
  return api.post("/api/clients", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
