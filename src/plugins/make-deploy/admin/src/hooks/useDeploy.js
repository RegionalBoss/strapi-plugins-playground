import { useState, useCallback } from "react";
import { deploysRequests } from "../api/deploys";
import { useNotification } from "@strapi/helper-plugin";

export const useDeploy = () => {
  const [loading, setLoading] = useState(false);
  const toggleNotification = useNotification();

  const makeRequest = useCallback(async (requestCallback) => {
    setLoading(true);
    try {
      return await requestCallback;
    } catch (error) {
      toggleNotification({
        type: "warning",
        message: error.message,
      });
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

  const createDeploy = useCallback(
    async (name) => makeRequest(deploysRequests.createDeploy(name)),
    []
  );

  return { loading, getDeploys, getDeploy };
};
