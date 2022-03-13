import axios from "axios";
import { apiUrl, getAuthHeader } from "./api";
import { UserUpdateModel } from "../models/user";

export const getAuthenticatedUser = () => {
  return axios.get(`${apiUrl}/user`, { headers: getAuthHeader() });
};

export const updateUser = async (data: UserUpdateModel) => {
  return axios.patch(`${apiUrl}/user`, data, {
    headers: getAuthHeader()
  });
};

export const deleteUser = async () => {
  return axios.delete(`${apiUrl}/user`, {
    headers: getAuthHeader()
  });
};

interface EmailUsername {
  username?: string;
  email?: string;
}

export const checkCredentials = async (credentials: EmailUsername) => {
  const res = await axios.get(`${apiUrl}/auth/check-credentials`, {
    params: credentials
  });

  return res.data.available;
};