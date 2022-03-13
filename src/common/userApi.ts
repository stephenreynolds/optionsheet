import axios from "axios";
import { getAuthHeader } from "./auth";

const url = process.env.NODE_ENV === "production" ? "" : "https://localhost:443";

export const getUsername = () => {
  return axios.get(`${url}/api/session/username`, { headers: getAuthHeader() });
};

export const getEmail = () => {
  return axios.get(`${url}/api/session/email`, { headers: getAuthHeader() });
};

export const changeUsername = async (username: string) => {
  return axios.post(`${url}/api/session/change_username`, { username }, {
    headers: getAuthHeader()
  });
};

export const changeEmail = async (email: string) => {
  return axios.post(`${url}/api/session/change_email`, { email }, {
    headers: getAuthHeader()
  });
};

export const changePassword = async (password: string, confirm: string) => {
  return axios.post(`${url}/api/session/change_password`, { password, confirm }, {
    headers: getAuthHeader()
  });
};

export const checkUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const res = await axios.post(`${url}/api/session/check_username_available`, {
    username
  });

  return res.data.usernameAvailable;
};

export const checkEmailAvailable = async (email: string) => {
  const res = await axios.post(`${url}/api/session/check_email_available`, {
    email
  });

  return res.data.emailAvailable;
};

export const deleteUser = async (username: string) => {
  return axios.delete(`${url}/api/users/${username}`, {
    headers: getAuthHeader()
  });
};