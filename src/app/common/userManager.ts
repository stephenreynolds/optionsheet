import { CreateUserModel } from "./user";
import axios from "axios";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const createUser = async (user: CreateUserModel): Promise<void> => {
  const res = await axios.post(`${url}/api/users`, user);
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
};

export const checkUsername = async (username: string): Promise<any> => {
  const res = await axios.post(`${url}/api/users/check_username`, {
    username
  });

  return res.data;
};

export const checkEmail = async (email: string): Promise<any> => {
  const res = await axios.post(`${url}/api/users/check_email`, {
    email
  });

  return res.data;
};
