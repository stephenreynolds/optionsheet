import axios from "axios";
import { CreateUserModel, Credentials } from "./models/user";

const url = process.env.NODE_ENV === "production" ? "" : "https://localhost:443";

export const register = async (user: CreateUserModel) => {
  return await axios.post(`${url}/api/users`, user);
};

export const login = async (credentials: Credentials) => {
  return axios
    .post(`${url}/api/auth/authenticate`, credentials)
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