import { useState, useCallback } from "react";
import { deploysRequests } from "../api/deploys";
import { useNotification } from "@strapi/helper-plugin";
import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

export const useDeploy = () => {
  const [loading, setLoading] = useState(false);
  const toggleNotification = useNotification();

  const makeRequest = useCallback(
    async <T extends { error?: { message?: string } }>(
      requestCallback: Promise<AxiosResponse<T>>
    ) => {
      setLoading(true);
      const showNotification = (message: string, type: string) => {
        toggleNotification({
          type: type,
          message: message,
        });
      };
      try {
        const { data } = await requestCallback;
        if (typeof data.error?.message !== "undefined") {
          showNotification(data.error.message, "warning");
          setLoading(false);
          return [];
        }
        return data;
      } catch (error) {
        showNotification(
          (error as AxiosError<{ error?: { message?: string } }>)?.response
            ?.data?.error?.message ?? (error as Error).message,
          "warning"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getDeploys = useCallback(
    async (whereQuery: Record<string, unknown>) =>
      makeRequest(deploysRequests.getDeploys(whereQuery)),
    []
  );

  const getDeploy = useCallback(
    async (id: number, params: AxiosRequestConfig) =>
      makeRequest(deploysRequests.getDeploy(id, params)),
    []
  );

  const startDeploy = useCallback(
    async (name: string) => makeRequest(deploysRequests.startDeploy(name)),
    []
  );

  return { loading, getDeploys, getDeploy, startDeploy };
};
