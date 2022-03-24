import { CreateUserModel, Credentials } from "../models/user";
import api from "./api";

export const register = async (user: CreateUserModel) => {
  return api
    .post(`/users`, user)
    .then((response) => {
      const { token, refresh_token } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

      return response.data;
    });
};

export const login = async (credentials: Credentials) => {
  return api
    .post(`/auth`, credentials)
    .then((response) => {
      const { token, refresh_token } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

      return response.data;
    });
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

interface EmailUsername {
  username?: string;
  email?: string;
}

export const checkCredentials = async (params: EmailUsername) => {
  return await api.get(`/auth/check-credentials`, { params })
    .then(() => true)
    .catch(() => false);
};