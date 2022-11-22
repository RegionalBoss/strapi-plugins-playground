import React, { useState } from "react";
import pluginId from "../../pluginId";
import { generateId } from "../../utils";
import { axiosInstance } from "../../utils/axiosInstance";
import { buildTree } from "../../utils/sortableTree";
import { EditMenuItemForm } from "../../components/EditMenuItemForm";

export const EditViewContext = React.createContext({
  isEditMode: false,
  items: [],
  pages: [],
});

export const EditViewContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [itemToUpdate, setItemToUpdate] = useState();
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
    setItemToUpdate(newItem);
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
        setItemToUpdate,
        itemToUpdate,
      }}
    >
      {itemToUpdate ? (
        <EditMenuItemForm onClose={() => setItemToUpdate(undefined)} />
      ) : null}
      {children}
    </EditViewContext.Provider>
  );
};
