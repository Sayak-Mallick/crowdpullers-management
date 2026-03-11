import { api } from "../wrapper/fetch.wrapper";

export const getClients = async () => {
  return api.get("/api/clients");
};