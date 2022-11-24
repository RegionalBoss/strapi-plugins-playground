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
  const [globalLoading, setGlobalLoading] = useState(false);
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
      setItems(buildTree(items.data));
      setPages(pages.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const saveData = async () => {
    setGlobalLoading(true);
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
      setGlobalLoading(false);
    }
  };

  const saveDataAndPickById = async (feGeneratedPageId, dataType = "item") => {
    const response = await saveData();
    if (!response) return;
    return response[`${dataType}FrontEndIdDatabaseIdMapper`]?.[
      feGeneratedPageId
    ];
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
    switch (type) {
      case ITEM_TYPE.PAGE: {
        const newPageId = generateId();
        newItem.pageId = newPageId;
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          t("createNew.item.default.PAGE.name")
        );

        setPages((currentPages) => {
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

  const duplicateItem = async (sourceItemId) => {
    const sourceItem = flattenTree(items).find(({ id }) => id === sourceItemId);
    const itemsNames = items.map(({ name }) => name);
    const itemName = getNextNameInTheSequence(itemsNames, sourceItem.name);

    const newItem = {
      ...sourceItem,
      id: generateId(),
      name: itemName,
      childOrder: 0,
    };
    if (newItem.type === ITEM_TYPE.PAGE) {
      const newPageId = generateId();
      const prevPage = pages.find(({ id }) => id === sourceItem.pageId);

      if (prevPage._feGenerated) {
        if (!prevPage._duplicatedFromPageId) {
          toggleNotification({
            type: "warning",
            message: `${pluginId}.duplicateItem.warning.message`,
          });
          return;
        }
        const prevPageDuplicateFromPage = pages.find(
          ({ id }) => id === prevPage._duplicatedFromPageId
        );
        if (prevPageDuplicateFromPage._feGenerated) {
          toggleNotification({
            type: "warning",
            message: `${pluginId}.duplicateItem.warning.extend.message`,
          });
          return;
        }
      }

      const newPage = {
        ...prevPage,
        id: newPageId,
        title: itemName,
        slug: stringToSlug(itemName),
        _feGenerated: true,
        _duplicatedFromPageId: prevPage._duplicatedFromPageId
          ? prevPage._duplicatedFromPageId
          : prevPage.id,
      };

      setPages((currentPages) => [...currentPages, newPage]);
      setIsEditMode(true);
      newItem.pageId = newPageId;
    }
    setItems((prev) => {
      const flatItems = flattenTree(prev);
      const sourceItemIndex = flatItems.findIndex(
        ({ id }) => id === sourceItemId
      );
      return buildTree([
        ...flatItems.slice(0, sourceItemIndex + 1),
        newItem,
        ...flatItems.slice(sourceItemIndex + 1),
      ]);
    });
    setItemToUpdate(newItem);
  };

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  const handleFormModalClose = (updateValue) => {
    if (updateValue) {
      setItems((prev) => {
        const flatTree = flattenTree(prev);
        const { id } = updateValue;
        const itemToUpdateIndex = flatTree.findIndex((item) => item.id === id);
        // replace the item in the array with the updated one by index
        const updatedItems = [
          ...flatTree.slice(0, itemToUpdateIndex),
          updateValue,
          ...flatTree.slice(itemToUpdateIndex + 1),
        ];
        return buildTree(updatedItems);
      });
    }
    setItemToUpdate(undefined);
  };
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
        saveDataAndPickById,
        duplicateItem,
        globalLoading,
      }}
    >
      {itemToUpdate ? (
        <EditMenuItemForm onClose={handleFormModalClose} />
      ) : null}
      {children}
    </EditViewContext.Provider>
  );
};
