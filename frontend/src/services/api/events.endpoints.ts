import useTokenStore from "@/store";
import { api } from "../wrapper/fetch.wrapper";

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getEvents = async () => {
  return api.get("/api/events");
};

export const createEvent = async (data: FormData) => {
  return api.post("/api/events", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
