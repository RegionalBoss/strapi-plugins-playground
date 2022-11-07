import axiosInstance from "../utils/axiosInstance";

export const settingsRequests = {
  getSettings: async (opts) =>
    (await axiosInstance.get("/make-deploy/settings", opts)).data,
  setSettings: async (data, opts) =>
    (
      await axiosInstance.post("/make-deploy/settings", data, {
        ...opts,
      })
    ).data,
  updateSetting: async (id, data, opts) =>
    (
      await axiosInstance.put(`/make-deploy/settings/${id}`, data, {
        ...opts,
      })
    ).data,
  deleteSetting: async (id, opts) =>
    (await axiosInstance.delete(`/make-deploy/settings/${id}`, opts)).data,
};
