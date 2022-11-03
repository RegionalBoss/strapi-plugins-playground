import axiosInstance from "../utils/axiosInstance";

export const taskRequests = {
  getTaskCount: async () => (await axiosInstance.get("/todo/count")).data,
  getSettings: async () => (await axiosInstance.get(`/todo/settings`)).data,
  setSettings: async (data) =>
    (
      await axiosInstance.post(`/todo/settings`, {
        body: data,
      })
    ).data,
};

export default taskRequests;
