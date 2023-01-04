import { IDeploySetting } from "../../../server/content-types/setting";
import axiosInstance from "../utils/axiosInstance";
import { AxiosRequestConfig } from "axios";

export const settingsRequests = {
  getSettings: async (opts?: AxiosRequestConfig) =>
    (await axiosInstance.get("/make-deploy/settings", opts)).data,
  setSettings: async (
    data: Partial<IDeploySetting>,
    opts?: AxiosRequestConfig
  ) =>
    (
      await axiosInstance.post("/make-deploy/settings", data, {
        ...opts,
      })
    ).data,
  updateSetting: async (
    id: number,
    data: Partial<IDeploySetting>,
    opts?: AxiosRequestConfig
  ) =>
    (
      await axiosInstance.put(`/make-deploy/settings/${id}`, data, {
        ...opts,
      })
    ).data,
  deleteSetting: async (id: string, opts?: AxiosRequestConfig) =>
    (await axiosInstance.delete(`/make-deploy/settings/${id}`, opts)).data,
};
