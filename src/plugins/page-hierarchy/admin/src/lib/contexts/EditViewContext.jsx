import React, { useState } from "react";
import pluginId from "../../pluginId";
import { axiosInstance } from "../../utils/axiosInstance";

export const EditViewContext = React.createContext({
  isEditMode: false,
  items: [],
  pages: [],
});

export const EditViewContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  return (
    <EditViewContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        items,
        setItems,
        pages,
      }}
    >
      {children}
    </EditViewContext.Provider>
  );
};

export const PAGE = "PAGE";
