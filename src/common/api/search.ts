import api from "./api";

export const search = async (params) => {
  return await api.get("/search", { params });
};