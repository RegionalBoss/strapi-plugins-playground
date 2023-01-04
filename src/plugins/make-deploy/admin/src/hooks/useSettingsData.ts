import React, { useState } from "react";
import { useNotification } from "@strapi/helper-plugin";
import { settingsRequests } from "../api/settings";
import { IDeploySetting } from "../../../server/content-types/setting";

export const useSettingsData = () => {
  const [settingsData, setSettingsData] = useState<IDeploySetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortController = new AbortController();
  const toggleNotification = useNotification();

  React.useEffect(() => {
    fetchData();
    return () => abortController.abort();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setSettingsData(
        await settingsRequests.getSettings({
          signal: abortController.signal,
        })
      );
    } catch (error) {
      console.error(error);
      toggleNotification({ type: "error", message: (error as Error).message });
    }
    setIsLoading(false);
  };

  return { settingsData, isLoading, refresh: fetchData };
};
