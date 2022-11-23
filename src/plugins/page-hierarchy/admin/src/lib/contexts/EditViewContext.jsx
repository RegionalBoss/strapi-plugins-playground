import React, { useState } from "react";
import pluginId from "../../pluginId";
import {
  generateId,
  getNextNameInTheSequence,
  stringToSlug,
} from "../../utils";
import { axiosInstance } from "../../utils/axiosInstance";
import { buildTree, flattenTree } from "../../utils/sortableTree";
import { EditMenuItemForm } from "../../components/EditMenuItemForm";
import { useNotification } from "@strapi/helper-plugin";

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

  const toggleNotification = useNotification();

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

  const saveData = async () => {
    console.log("save state", flattenTree(items));
    try {
      const { data } = await axiosInstance.put(`/${pluginId}/items`, {
        items: flattenTree(items).map((item, index) => ({
          ...item,
          childOrder: index,
        })),
        pages,
      });

      toggleNotification({
        type: "success",
        message: `${pluginId}.saveData.success`,
      });

      setItems(buildTree(data.items));
      setPages(data.pages);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      toggleEditMode();
    }
  };

  const saveDataAndPickByPageId = async (feGeneratedPageId) => {
    const response = await saveData();
    if (!response) return;
    return response.pageFrontEndIdDatabaseIdMapper[feGeneratedPageId];
  };

  const deleteItem = (itemToDelete) => {
    setItems((prevItems) => {
      let filteredData = [prevItems, pages];

      /**
       * gets all children from item in a flat list with that item, with pages ids of that items
       * filters list of items, removing all items that are in the list of items to delete
       * [[...items], [...pages]] - filtered items and page ids to be deleted thet left after deleting
       * goes through all items and checks if there is a page relation, to a page id thet must be deleted
       * if there is a relation, it will do the same thing with that item and its children recursively, reducing the list of items that left, and populating list of pages to delete
       *
       */
      const getFilteredDataRecursively = (item) => {
        const nestedItemsToDelete = [item, ...flattenTree(item.children)];
        const itemsIdsToDelete = nestedItemsToDelete.map((item) => item.id);
        const pagesIdsToDelete = nestedItemsToDelete
          .filter((item) => item.type === ITEM_TYPE.PAGE)
          .map((item) => item.pageId);

        filteredData = [
          buildTree(
            flattenTree(filteredData[0]).filter(
              ({ id }) => !itemsIdsToDelete.includes(id)
            )
          ),
          filteredData[1].filter(({ id }) => !pagesIdsToDelete.includes(id)),
        ];

        flattenTree(filteredData[0]).forEach((item) => {
          if (pagesIdsToDelete.includes(item.pageId)) {
            getFilteredDataRecursively(item);
          }
        });
      };
      getFilteredDataRecursively(itemToDelete);

      setPages(filteredData[1]);
      return filteredData[0];
    });
    setItemToUpdate(undefined);
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
        deleteItem,
        saveData,
        saveDataAndPickByPageId,
      }}
    >
      {itemToUpdate ? (
        <EditMenuItemForm
          onClose={(updateValue) => {
            if (updateValue) {
              console.log({ pages, items });
              setItems((prev) => {
                const flatTree = flattenTree(prev);
                const { id } = updateValue;
                const itemToUpdateIndex = flatTree.findIndex(
                  (item) => item.id === id
                );
                // replace the item in the array with the updated one by index
                const updatedItems = [
                  ...flatTree.slice(0, itemToUpdateIndex),
                  updateValue,
                  ...flatTree.slice(itemToUpdateIndex + 1),
                ];
                setItems(buildTree(updatedItems));
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
