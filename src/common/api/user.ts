import axios from "axios";
import { apiRoot, getAuthHeader } from "./api";
import { UserUpdateModel } from "../models/user";

export const getAuthenticatedUser = () => {
  return axios.get(`${apiRoot}/user`, { headers: getAuthHeader() });
};

export const updateUser = async (data: UserUpdateModel) => {
  return axios.patch(`${apiRoot}/user`, data, {
    headers: getAuthHeader()
  });
};

export const deleteUser = async () => {
  return axios.delete(`${apiRoot}/user`, {
    headers: getAuthHeader()
  });
};

interface EmailUsername {
  username?: string;
  email?: string;
}

export const checkCredentials = async (credentials: EmailUsername) => {
  const res = await axios.get(`${apiRoot}/auth/check-credentials`, {
    params: credentials
  });

  return res.data.available;
};