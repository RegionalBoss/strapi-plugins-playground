import { axiosInstance } from "../utils/axiosInstance";
import qs from "qs";

export const deploysRequests = {
  getDeploys: async (params) =>
    (
      await axiosInstance.get(
        `/make-deploy/deploy?${qs.stringify({
          orderBy: { createdAt: "DESC" },
          limit: 1,
          ...params,
        })}`
      )
    ).data,
  getDeploy: async (id, params) =>
    (await axiosInstance.get(`/make-deploy/deploy/${id}`, params)).data,
};
