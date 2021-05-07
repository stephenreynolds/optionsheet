import { CreateUserModel, Credentials } from "./models/user";
import axios, { AxiosResponse } from "axios";
import { getAuthHeader } from "./auth";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const register = async (
  user: CreateUserModel
): Promise<AxiosResponse> => {
  return await axios.post(`${url}/api/users`, user);
};

export const checkUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const res = await axios.post(`${url}/api/auth/check_username_available`, {
    username
  });

  return res.data.usernameAvailable;
};

export const checkEmailAvailable = async (email: string): Promise<boolean> => {
  const res = await axios.post(`${url}/api/auth/check_email_available`, {
    email
  });

  return res.data.usernameAvailable;
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

export const getUserInfo = (username: string) => {
  return axios.get(`${url}/api/users/${username}`);
};

export const getMyInfo = () => {
  return axios.get(`${url}/api/auth/me`, { headers: getAuthHeader() });
};
