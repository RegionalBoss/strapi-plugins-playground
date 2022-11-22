/*
 *
 * HomePage
 *
 */

import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system";
import React from "react";
import { Button, Flex } from "@strapi/design-system";
import Pencil from "@strapi/icons/Pencil";
import Cross from "@strapi/icons/Cross";
import Check from "@strapi/icons/Check";
import { SortableMenu } from "../../components/Sortable/SortableMenu";
import { useTranslation } from "../../hooks/useTranslation";
import { EditViewContext, ITEM_TYPE } from "../../lib/contexts/EditViewContext";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { flattenTree } from "../../utils/sortableTree";
import { axiosInstance } from "../../utils/axiosInstance";
import pluginId from "../../pluginId";

const CREATE_NEW_BUTTONS = [
  {
    type: ITEM_TYPE.SYMBOLIC_LINK,
    label: "EditView.addSymbolicLink.button",
  },
  {
    type: ITEM_TYPE.PAGE,
    label: "EditView.addPage.button",
  },
  {
    type: ITEM_TYPE.LABEL,
    label: "EditView.addLabel.button",
  },
  {
    type: ITEM_TYPE.URL,
    label: "EditView.addExternalLink.button",
  },
  {
    type: ITEM_TYPE.HARD_LINK,
    label: "EditView.addHardLink.button",
  },
];

const HomePage = () => {
  const { isEditMode, toggleEditMode, addNewItem, items, pages, refreshData } =
    React.useContext(EditViewContext);
  const { showConfirmDialog } = useConfirmDialog();
  const { t } = useTranslation();

  const PrimaryActions = React.useCallback(() => {
    if (!isEditMode)
      return (
        <Button onClick={toggleEditMode} startIcon={<Pencil />}>
          {t("editMode")}
        </Button>
      );
    return (
      <Flex>
        <Button
          variant="tertiary"
          startIcon={<Cross />}
          style={{ marginRight: "0.5rem" }}
          onClick={async () => {
            if (
              await showConfirmDialog(
                t("cancelEditMode.willDiscardChanges.confirm.title"),
                t("cancelEditMode.willDiscardChanges.confirm.message")
              )
            ) {
              refreshData();
              toggleEditMode();
            }
          }}
        >
          {t("cancelEditMode")}
        </Button>
        <Button
          startIcon={<Check />}
          onClick={async () => {
            console.log("save state", flattenTree(items));
            try {
              await axiosInstance.put(`/${pluginId}/items`, {
                items: flattenTree(items).map((item, index) => ({
                  ...item,
                  childOrder: index,
                })),
                pages,
              });
            } catch (e) {
              console.error(e);
            }
            toggleEditMode();
          }}
        >
          {t("saveChanges")}
        </Button>
      </Flex>
    );
  }, [isEditMode, toggleEditMode]);

  const EditNewButtons = React.useCallback(() => {
    if (!isEditMode) return null;
    return (
      <Flex wrap="wrap">
        {CREATE_NEW_BUTTONS.map((BUTTON) => (
          <Button
            variant="tertiary"
            key={BUTTON.type}
            onClick={() => addNewItem(BUTTON.type)}
            style={{ marginRight: "1rem", marginBottom: "1rem" }}
          >
            {t(BUTTON.label)}
          </Button>
        ))}
      </Flex>
    );
  }, [isEditMode]);

  return (
    <>
      <BaseHeaderLayout
        title={t("plugin.name")}
        subtitle={t("description")}
        as="h2"
        primaryAction={<PrimaryActions />}
      />
      <ContentLayout>
        <EditNewButtons />
        <SortableMenu />
      </ContentLayout>
    </>
  );
};

export default HomePage;
