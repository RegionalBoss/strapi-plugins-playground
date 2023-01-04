import { AxiosRequestConfig } from "axios";
import axiosInstance from "../utils/axiosInstance";

export const rolesRequests = {
  getRoles: async (opts?: AxiosRequestConfig) =>
    (await axiosInstance.get("/admin/roles", opts)).data,
};
