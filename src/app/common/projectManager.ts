import axios from "axios";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const getProjects = async (userId: number) => {
  return await axios.get(`${url}/api/projects`, {
    headers: {
      userId
    }
  });
};
