import { axiosInstance } from "../utils/axiosInstance";
import qs from "qs";

export const deploysRequests = {
  getDeploys: async (whereQuery) =>
    await axiosInstance.get(
      `/make-deploy/deploy?${qs.stringify({
        orderBy: { createdAt: "DESC" },
        limit: 1,
        populate: {
          deployStatuses: true,
          createdBy: true,
          updatedBy: true,
        },
        where: whereQuery,
      })}`
    ),
  getDeploy: async (id, params) =>
    await axiosInstance.get(`/make-deploy/deploy/${id}`, params),
  startDeploy: async (name) =>
    await axiosInstance.post(`/make-deploy/deploy`, {
      isFinal: false,
      message: "Spuštění buildu ve strapi",
      stage: "FE Strapi",
      status: "info",
      name,
    }),
};
