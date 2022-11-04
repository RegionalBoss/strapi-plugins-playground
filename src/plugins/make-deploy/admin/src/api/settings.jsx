import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const settingsRequests = {
  getSettings: async (opts) =>
    (await axiosInstance.get("/make-deploy/settings", opts)).data,
  setSettings: async (data, opts) =>
    (
      await axiosInstance.post("/make-deploy/settings", {
        body: data,
        ...opts,
      })
    ).data,
};

export const useSettingsData = () => {
  const [settingsData, setSettingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortController = new AbortController();

  React.useEffect(async () => {
    setIsLoading(true);
    try {
      setSettingsData(
        await settingsRequests.getSettings({
          signal: abortController.signal,
        })
      );
    } catch (error) {
      console.error(error);
      strapi.notification.toggle({ type: "error", message: error.message });
    }
    setIsLoading(false);
    return () => abortController.abort();
  }, []);

  return { settingsData, isLoading };
};
