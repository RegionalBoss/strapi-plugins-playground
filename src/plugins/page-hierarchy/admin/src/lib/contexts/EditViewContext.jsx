import React, { useState } from "react";
import pluginId from "../../pluginId";
import { generateId } from "../../utils";
import { axiosInstance } from "../../utils/axiosInstance";
import { buildTree } from "../../utils/sortableTree";

export const ITEM_TYPE = {
  SYMBOLIC_LINK: "SYMBOLIC_LINK",
  HARD_LINK: "HARD_LINK",
  URL: "URL",
  PAGE: "PAGE",
  LABEL: "LABEL",
};

export const EditViewContext = React.createContext({
  isEditMode: false,
  items: [],
  pages: [],
});

export const EditViewContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  React.useEffect(() => {
    loadInitData();
  }, []);

  const loadInitData = async () => {
    try {
      const [pages, items] = await Promise.all([
        axiosInstance.get(`/${pluginId}/flat-pages`),
        axiosInstance.get(`/${pluginId}/flat-items`),
      ]);
      console.log({ pages: pages.data, items: items.data });
      setItems(buildTree(items.data));
      setPages(pages.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const addNewItem = (type) => {
    const itemsNames = items.map(({ name }) => name);
    const newItemId = generateId();
    const newItem = {
      id: newItemId,
      type,
      isVisible: true,
      isProtected: false,
      excludeFromHierarchy: false,
      goToClosestChild: false,
      visibleFrom: null,
      visibleTo: null,
    };
    console.log("newItem: ", { newItem, type, itemsNames });
  };

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  return (
    <EditViewContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        items,
        setItems,
        pages,
        addNewItem,
        refreshData: loadInitData,
      }}
    >
      {children}
    </EditViewContext.Provider>
  );
};
