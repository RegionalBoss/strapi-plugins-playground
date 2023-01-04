import { useState, useCallback } from "react";
import { deploysRequests } from "../api/deploys";
import { useNotification } from "@strapi/helper-plugin";

export const useDeploy = () => {
  const [loading, setLoading] = useState(false);
  const toggleNotification = useNotification();

  const makeRequest = useCallback(async (requestCallback) => {
    setLoading(true);
    const showNotification = (message, type) => {
      toggleNotification({
        type: type,
        message: message,
      });
    };
    try {
      const { data } = await requestCallback;
      if (typeof data.error !== "undefined") {
        showNotification(data.error?.message, "warning");
        setLoading(false);
        return [];
      }
      return data;
    } catch (error) {
      showNotification(
        error?.response?.data?.error?.message ?? error.message,
        "warning"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeploys = useCallback(
    async (whereQuery) => makeRequest(deploysRequests.getDeploys(whereQuery)),
    []
  );

  const getDeploy = useCallback(
    async (id, params) => makeRequest(deploysRequests.getDeploy(id, params)),
    []
  );

  const startDeploy = useCallback(
    async (name) => makeRequest(deploysRequests.startDeploy(name)),
    []
  );

  return { loading, getDeploys, getDeploy, startDeploy };
};
