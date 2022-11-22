import React, { useState } from "react";
import pluginId from "../../pluginId";
import {
  generateId,
  getNextNameInTheSequence,
  stringToSlug,
} from "../../utils";
import { axiosInstance } from "../../utils/axiosInstance";
import { buildTree } from "../../utils/sortableTree";
import { EditMenuItemForm } from "../../components/EditMenuItemForm";
import { ITEM_TYPE } from "../constants";
import { useTranslation } from "../../hooks/useTranslation";

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

  const { t } = useTranslation();

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
    switch (type) {
      case ITEM_TYPE.PAGE: {
        const newPageId = generateId();
        newItem.pageId = newPageId;
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.PAGE.name")
        );

        setPages((prev) => {
          const currentPages = prev;
          const pagesNames = currentPages.map(({ title }) => title);
          const pageName = getNextNameInTheSequence(
            pagesNames,
            t("createNew.page.default.name")
          );

          const newPage = {
            id: newPageId,
            title: pageName,
            slug: stringToSlug(pageName),
            _feGenerated: true,
          };
          return [...currentPages, newPage];
        });
        break;
      }
      case ITEM_TYPE.LABEL:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.LABEL.name")
        );
        break;

      case ITEM_TYPE.URL:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.URL.name")
        );
        newItem.absoluteLinkUrl = "https://strapi.io";
        break;

      case ITEM_TYPE.SYMBOLIC_LINK:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.SYMBOLIC_LINK.name")
        );
        newItem.pageId = pages[0] ? pages[0].id : null;
        break;

      case ITEM_TYPE.HARD_LINK:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.HARD_LINK.name")
        );
        newItem.pageId = pages[0] ? pages[0].id : null;
        break;

      default:
        break;
    }
    setItems((prev) => [
      { ...newItem, childOrder: 0, parentItem: undefined },
      ...prev,
    ]);
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
        setPages,
        addNewItem,
        refreshData: loadInitData,
        setItemToUpdate,
        itemToUpdate,
      }}
    >
      {itemToUpdate ? (
        <EditMenuItemForm
          onClose={(updateValue) => {
            if (updateValue) {
              console.log({ pages, items });
              setItems((prev) => {
                const { id } = updateValue;
                const itemToUpdateIndex = prev.findIndex(
                  (item) => item.id === id
                );
                // replace the item in the array with the updated one by index
                const updatedItems = [
                  ...prev.slice(0, itemToUpdateIndex),
                  updateValue,
                  ...prev.slice(itemToUpdateIndex + 1),
                ];
                setItems(updatedItems);
              });
            }
            setItemToUpdate(undefined);
          }}
        />
      ) : null}
      {children}
    </EditViewContext.Provider>
  );
};
