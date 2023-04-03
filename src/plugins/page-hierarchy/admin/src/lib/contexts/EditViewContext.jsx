import React from "react";
import { injectIntl } from "react-intl";
import pluginId from "../../pluginId";
import { useNotification } from "@strapi/helper-plugin";

import { Prompt } from "react-router";
import {
  generateId,
  getNextNameInTheSequence,
  stringToSlug,
} from "../../utils";
import { axiosInstance } from "../../utils/axiosInstance";

import { ITEM_TYPE } from "../constants";

export const DEBUG_MODE = false;

export const EditViewContext = React.createContext({
  editMode: false,
  items: [],
  pages: [],
});

export class _EditViewContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialItems: [],
      initialPages: [],
      items: [],
      pages: [],
      selectedItemId: null,
      editMode: DEBUG_MODE,
      globalLoading: false,
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.getAllNestedItems = this.getAllNestedItems.bind(this);
    this.resetItems = this.resetItems.bind(this);
    this.duplicateItem = this.duplicateItem.bind(this);
    this.saveData = this.saveData.bind(this);
    this.saveDataAndPickById = this.saveDataAndPickById.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.setItems = this.setItems.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.setSelectedItemId = this.setSelectedItemId.bind(this);
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleFormModalClose = this.handleFormModalClose.bind(this);
  }

  onBeforeUnload() {
    if (this.state.editMode) {
      return this.props.intl.formatMessage({
        id: "page-hierarchy.onUnsavedChanges.alert",
      });
    }
  }

  onBeforeUnload() {
    if (this.state.editMode) {
      return this.props.intl.formatMessage({
        id: "page-hierarchy.onUnsavedChanges.alert",
      });
    }
  }

  async componentDidMount() {
    this.setState({ globalLoading: true });
    try {
      const [{ data: pages }, { data: items }] = await Promise.all([
        // clear sended data
        axiosInstance.get(`/${pluginId}/flat-pages`),
        // clear sended data
        axiosInstance.get(`/${pluginId}/flat-items`),
      ]);

      this.setState({
        globalLoading: false,
        selectedItemId: null,
        initialPages: pages,
        initialItems: items,
        pages,
        items,
      });
    } catch (err) {
      console.error(err);
      // window.strapi.notification.error(err.message);
    }
    this.setState({ globalLoading: false });

    if (!DEBUG_MODE) {
      window.onbeforeunload = this.onBeforeUnload;
    }
  }

  deleteItem(itemId) {
    const nestedItemsToDelete = this.getAllNestedItems(itemId);
    const nestedItemsIdsToDelete = nestedItemsToDelete.map(({ id }) => id);
    const pagesIdsToDelete = nestedItemsToDelete
      .filter((item) => item.type === ITEM_TYPE.PAGE)
      .map((item) => item.pageId);

    const itemsIdsToDelete = nestedItemsIdsToDelete;
    this.setState(
      (p) => ({
        items: p.items.filter((item) => !itemsIdsToDelete.includes(item.id)),
        pages: p.pages.filter((page) => !pagesIdsToDelete.includes(page.id)),
        selectedItemId: null,
      }),
      () => {
        // remove inconsistent relations
        // for all symlinks & hard-links connected to some deleted page
        this.state.items.forEach((item) => {
          if (pagesIdsToDelete.includes(item.pageId)) {
            this.deleteItem(item.id);
          }
        });
      }
    );
  }

  updateItem(itemId, attrs) {
    this.setState((p) => ({
      items: p.items.map((item) =>
        item.id === itemId ? { ...item, ...attrs } : item
      ),
    }));
  }

  resetItems() {
    this.setState((p) => ({
      selectedItemId: null,
      items: p.initialItems,
      pages: p.initialPages,
      editMode: false,
    }));
  }

  getAllNestedItems(itemId) {
    const item = this.state.items.find((item) => item.id === itemId);
    if (!item || !itemId) {
      return [];
    }
    return [
      item,
      ...this.state.items
        .filter((i) => i.parentId === itemId)
        .map((i) => this.getAllNestedItems(i.id))
        .flat(),
    ];
  }

  async saveData() {
    try {
      this.setState({
        globalLoading: true,
        editMode: false,
      });

      const { data: responseData } = await axiosInstance.put(
        `/${pluginId}/items`,
        {
          // clear sended data
          items: this.state.items,
          // clear sended data
          pages: this.state.pages,
        }
      );

      this.props.toggleNotification({
        type: "success",
        message: `${pluginId}.saveData.success`,
      });

      // I use class coz i want to have async state settings
      return new Promise((resolve) => {
        this.setState(
          {
            globalLoading: false,
            selectedItemId: null,
            initialPages: responseData.pages,
            initialItems: responseData.items,
            pages: responseData.pages,
            items: responseData.items,
          },
          () => resolve(responseData)
        );
      });
    } catch (err) {
      this.props.toggleNotification({
        type: "warning",
        message: err.message,
      });
      this.setState({ globalLoading: false });
    }
  }

  // TODO: refactor
  duplicateItem(sourceItemId) {
    const { items, pages } = this.state;

    const sourceItem = items.find(({ id }) => id === sourceItemId);

    const names = items.map(({ name }) => name);

    const newItem = {
      ...sourceItem,
      name: getNextNameInTheSequence(names, sourceItem.name),
      childOrder: sourceItem.childOrder + 1,
      id: generateId(),
    };

    if (newItem.type === ITEM_TYPE.PAGE) {
      const newPageId = generateId();
      const prevPage = pages.find(({ id }) => id === newItem.pageId);

      // cant duplicate from page which is not saved in the database
      // this condition should never become
      if (prevPage._feGenerated) {
        if (!prevPage._duplicatedFromPageId) {
          this.props.toggleNotification({
            type: "warning",
            message: `${pluginId}.duplicateItem.warning.message`,
          });
          return;
        }
        const prevPageDuplicatedFromPage = pages.find(
          ({ id }) => id === prevPage._duplicatedFromPageId
        );
        if (prevPageDuplicatedFromPage._feGenerated) {
          this.props.toggleNotification({
            type: "warning",
            message: `${pluginId}.duplicateItem.warning.extend.message`,
          });
          return;
        }
      }

      const newPage = {
        ...prevPage,
        id: newPageId,
        _feGenerated: true,
        // do not support to duplicate duplicated page on the frontend
        // API support only reference to real exist page (not alias via some duplicity)
        _duplicatedFromPageId: prevPage._duplicatedFromPageId
          ? prevPage._duplicatedFromPageId
          : prevPage.id,
      };

      this.setState((p) => ({
        pages: [...p.pages, newPage],
        editMode: true,
      }));
      newItem.pageId = newPageId;
    }

    this.setState((p) => ({
      items: [
        newItem,
        ...p.items.map((i) => ({
          ...i,
          // shift all sibling below new duplicated item
          childOrder:
            i.parentId === newItem.parentId &&
            i.childOrder >= newItem.childOrder
              ? i.childOrder + 1
              : i.childOrder,
        })),
      ],
      selectedItemId: newItem.id,
    }));
  }

  async saveDataAndPickById(feGeneratedPageId, dataType = "item") {
    const response = await this.saveData();
    if (!response) return;
    return response[`${dataType}FrontEndIdDatabaseIdMapper`]?.[
      feGeneratedPageId
    ];
  }

  addNewItem(type) {
    const formatMessage = this.props.intl.formatMessage;
    const itemsNames = this.state.items.map(({ name }) => name);
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
          formatMessage({
            id: "page-hierarchy.createNew.item.default.PAGE.name",
          })
        );

        const pages = this.state.pages;
        const pagesNames = pages.map(({ title }) => title);
        const pageName = getNextNameInTheSequence(
          pagesNames,
          formatMessage({ id: "page-hierarchy.createNew.page.default.name" })
        );

        const newPage = {
          id: newPageId,
          title: pageName,
          slug: stringToSlug(pageName),
          _feGenerated: true,
        };

        this.setState((p) => ({
          pages: [...p.pages, newPage],
        }));
        break;
      }
      case ITEM_TYPE.LABEL:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          formatMessage({
            id: "page-hierarchy.createNew.item.default.LABEL.name",
          })
        );
        break;

      case ITEM_TYPE.URL:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          formatMessage({
            id: "page-hierarchy.createNew.item.default.URL.name",
          })
        );
        newItem.absoluteLinkUrl = "https://strapi.io";
        break;

      case ITEM_TYPE.SYMBOLIC_LINK:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          formatMessage({
            id: "page-hierarchy.createNew.item.default.SYMBOLIC_LINK.name",
          })
        );
        newItem.pageId = this.state.pages[0] ? this.state.pages[0].id : null;
        break;

      case ITEM_TYPE.HARD_LINK:
        newItem.name = getNextNameInTheSequence(
          itemsNames,
          formatMessage({
            id: "page-hierarchy.createNew.item.default.HARD_LINK.name",
          })
        );
        newItem.pageId = this.state.pages[0] ? this.state.pages[0].id : null;
        break;

      default:
        break;
    }

    this.setState((p) => ({
      items: [
        {
          ...newItem,
          childOrder: 0,
          parentItem: null,
        },
        ...p.items.map((item) => ({
          ...item,
          // shift all items 1 bellow
          childOrder: item.parentId ? item.childOrder : item.childOrder + 1,
        })),
      ],
      selectedItemId: newItemId,
    }));
  }

  setEditMode(newEditMode) {
    this.setState({ editMode: newEditMode });
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  setItems(newItems) {
    this.setState({ items: newItems });
  }

  setSelectedItemId(newSelectedItemId) {
    this.setState({ selectedItemId: newSelectedItemId });
  }

  handleFormModalClose(updateValue) {
    if (updateValue) this.updateItem(updateValue.id, updateValue);
    this.setSelectedItemId(undefined);
  }

  render() {
    return (
      <EditViewContext.Provider
        value={{
          refreshData: this.resetItems,
          deleteItem: this.deleteItem,
          setItems: this.setItems,
          saveData: this.saveData,
          saveDataAndPickByPageId: this.saveDataAndPickByPageId,
          saveDataAndPickByItemId: this.saveDataAndPickByItemId,
          setEditMode: this.setEditMode,
          setSelectedItemId: this.setSelectedItemId,
          updateItem: this.updateItem,
          addNewItem: this.addNewItem,
          duplicateItem: this.duplicateItem,
          toggleEditMode: this.toggleEditMode,
          handleFormModalClose: this.handleFormModalClose,
          // data
          pages: this.state.pages,
          items: this.state.items,
          isEditMode: this.state.editMode,
          selectedItemId: this.state.selectedItemId,
          globalLoading: this.state.globalLoading,
          isLoading: this.state.globalLoading,
        }}
      >
        <Prompt
          when={this.state.editMode}
          message={this.props.intl.formatMessage({
            id: "page-hierarchy.onUnsavedChanges.alert",
          })}
        />
        {this.props.children}
      </EditViewContext.Provider>
    );
  }
}

const withNotification = (WrappedComponent) => {
  return (props) => {
    const toggleNotification = useNotification();
    return (
      <WrappedComponent {...props} toggleNotification={toggleNotification} />
    );
  };
};

export const EditViewContextProvider = injectIntl(
  withNotification(_EditViewContextProvider)
);

export default EditViewContext;
