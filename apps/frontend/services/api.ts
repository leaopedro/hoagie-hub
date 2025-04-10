import axios, { AxiosInstance } from "axios";
import { User } from "../context/UserContext";

export const createApi = (user?: User | null): AxiosInstance => {
  const instance = axios.create({
    baseURL: "http://localhost:3000",
  });

  instance.interceptors.request.use((config) => {
    if (user?._id) {
      config.headers["x-user-id"] = user._id;
    }
    return config;
  });

  return instance;
};
