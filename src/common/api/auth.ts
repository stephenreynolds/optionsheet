import axios from "axios";
import { CreateUserModel, Credentials } from "../models/user";
import { apiRoot } from "./api";

export const register = async (user: CreateUserModel) => {
  return axios
    .post(`${apiRoot}/users`, user)
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
      }

      return response.data;
    });
};

export const login = async (credentials: Credentials) => {
  return axios
    .post(`${apiRoot}/auth`, credentials)
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
      }

      return response.data;
    });
};

export const logout = async () => {
  localStorage.removeItem("token");
};