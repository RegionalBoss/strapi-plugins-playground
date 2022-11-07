import { axiosInstance } from "../utils/axiosInstance";
import qs from "qs";

export const deploysRequests = {
  getDeploys: async (whereQuery) =>
    (
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
      )
    ).data,
  getDeploy: async (id, params) =>
    (await axiosInstance.get(`/make-deploy/deploy/${id}`, params)).data,
};
