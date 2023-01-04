import axiosInstance from "../utils/axiosInstance";

export const rolesRequests = {
  getRoles: async (opts) =>
    (await axiosInstance.get("/admin/roles", opts)).data,
};
