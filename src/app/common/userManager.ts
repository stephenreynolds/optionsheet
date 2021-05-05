import { CreateUserModel, Credentials } from "./user";
import axios from "axios";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const register = async (user: CreateUserModel) => {
  return await axios.post(`${url}/api/users`, user);
};

export const checkUsername = async (username: string): Promise<string> => {
  const res = await axios.post(`${url}/api/users/check_username`, {
    username
  });

  return res.data;
};

export const checkEmail = async (email: string): Promise<string> => {
  const res = await axios.post(`${url}/api/users/check_email`, {
    email
  });

  return res.data;
};

export const login = async (credentials: Credentials): Promise<string> => {
  return axios
    .post(`${url}/api/auth/authenticate`, credentials)
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  if (token) {
    return { "x-access-token": token };
  }

  return {};
};

export const getUserInfo = (username: string) => {
  return axios.get(`${url}/api/users/${username}`);
};

export const getMyInfo = () => {
  return axios.get(`${url}/api/auth/me`, { headers: getAuthHeader() });
};
