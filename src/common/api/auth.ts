import { CreateUserModel, Credentials } from "../models/user";
import api from "./api";

export const register = async (user: CreateUserModel) => {
  return api
    .post(`/users`, user)
    .then(({ data }) => {
      const { token, refresh_token } = data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
    });
};

export const login = async (credentials: Credentials) => {
  return api
    .post(`/auth`, credentials)
    .then(({ data }) => {
      const { token, refresh_token } = data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
    });
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

interface EmailUsername {
  username?: string;
  email?: string;
}

export const checkCredentials = async (params: EmailUsername): Promise<boolean> => {
  return api.get(`/auth/check-credentials`, { params })
    .then(() => true)
    .catch(() => false);
};

export const isLoggedIn = !!window.localStorage.getItem("token");