import {CreateUserModel} from "./user";
import axios from "axios";

const url = process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const createUser = async (user: CreateUserModel): Promise<void> => {
  const res = await axios.post(`${url}/api/users`, user);
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
};