import React, { useState } from "react";
import pluginId from "../pluginId";
import { axiosInstance } from "../utils/axiosInstance";

export const EditViewContext = React.createContext({});

export const EditViewContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [isEditView, setIsEditView] = useState(false);

  React.useEffect(async () => {
    try {
      const [pages, items] = await Promise.all([
        axiosInstance.get(`${pluginId}/flat-pages`),
        axiosInstance.get(`${pluginId}/flat-items`),
      ]);
      console.log({ pages: pages.data, items: items.data });
      setItems(items.data);
      setPages(pages.data);
    } catch (ex) {
      console.error(ex);
    }
  }, []);

  return (
    <EditViewContext.Provider
      value={{ isEditView, setIsEditView, items, setItems, pages }}
    >
      {children}
    </EditViewContext.Provider>
  );
};

export const PAGE = "PAGE";
