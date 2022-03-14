import { CreateUserModel, Credentials } from "../models/user";
import api from "./api";

export const register = async (user: CreateUserModel) => {
  return api
    .post(`/users`, user)
    .then((response) => {
      const { token, refreshToken } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

      return response.data;
    });
};

export const login = async (credentials: Credentials) => {
  return api
    .post(`/auth`, credentials)
    .then((response) => {
      const { token, refreshToken } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

      return response.data;
    });
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const refreshToken = async (refreshToken: string) => {
  return api.post(`/auth/refresh`, { refreshToken });
};

interface EmailUsername {
  username?: string;
  email?: string;
}

export const checkCredentials = async (params: EmailUsername) => {
  const res = await api.get(`/auth/check-credentials`, { params });

  return res.data.available;
};