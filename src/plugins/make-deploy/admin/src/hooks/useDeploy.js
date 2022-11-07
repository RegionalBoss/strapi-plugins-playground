import { useState, useCallback } from "react";
import { deploysRequests } from "../api/deploys";
import { useNotification } from "@strapi/helper-plugin";

export const useDeploy = () => {
  const [loading, setLoading] = useState(false);
  const toggleNotification = useNotification();

  const getDeploys = useCallback(async (params) => {
    setLoading(true);
    try {
      return await deploysRequests.getDeploys(params);
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

  const getDeploy = useCallback(async (id, params) => {
    setLoading(true);
    try {
      return await deploysRequests.getDeploy(id, params);
    } catch (error) {
      toggleNotification({
        type: "warning",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, getDeploys, getDeploy };
};
