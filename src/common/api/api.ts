import axios from "axios";

export const baseURL = "http://localhost:5000";

const getToken = (): string => {
  return JSON.parse(window.localStorage.getItem("token"));
};

const setToken = (token) => {
  return window.localStorage.setItem("token", JSON.stringify(token));
};

const getRefreshToken = (): string => {
  return JSON.parse(window.localStorage.getItem("refresh_token"));
};

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && !originalConfig._retry && getToken()) {
      originalConfig._retry = true;
      try {
        const response = await instance.post("/auth/refresh", {
          refresh_token: getRefreshToken()
        });

        const { token } = response.data;
        setToken(token);
        return instance(originalConfig);
      }
      catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;