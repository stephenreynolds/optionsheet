import axios from "axios";
import { CreateUserModel, Credentials } from "../models/user";
import { apiUrl } from "./api";

export const register = async (user: CreateUserModel) => {
  return await axios.post(`${apiUrl}/users`, user);
};

export const login = async (credentials: Credentials) => {
  return axios
    .post(`${apiUrl}/auth`, credentials)
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