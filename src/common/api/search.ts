import api, { ApiResponse } from "./api";
import { SearchModel } from "../models/search";

export const search = async (params): ApiResponse<SearchModel> => {
  return await api.get("/search", { params });
};