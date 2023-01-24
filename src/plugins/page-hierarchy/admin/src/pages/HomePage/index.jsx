/*
 *
 * HomePage
 *
 */

import {
  BaseHeaderLayout,
  Button,
  ContentLayout,
  Flex,
  Layout,
  Loader,
} from "@strapi/design-system";
import Check from "@strapi/icons/Check";
import Cross from "@strapi/icons/Cross";
import Pencil from "@strapi/icons/Pencil";
import React from "react";
import { SortableMenu } from "../../components/Sortable/SortableMenu";
import { useTranslation } from "../../hooks/useTranslation";
import { ITEM_TYPE } from "../../lib/constants";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { Illo } from "../../components/Illo";
import { EditMenuItemForm } from "../../components/EditMenuItemForm";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";

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
  const {
    isEditMode,
    toggleEditMode,
    addNewItem,
    saveData,
    refreshData,
    items,
    isLoading,
    itemToUpdate,
    handleFormModalClose,
  } = React.useContext(EditViewContext);
  const { showConfirmDialog } = useConfirmDialog();
  const { t } = useTranslation();

  const PrimaryActions = React.useCallback(() => {
    if (!isEditMode)
      return (
        <Button
          onClick={toggleEditMode}
          startIcon={<Pencil />}
          loading={isLoading}
        >
          {isLoading ? t("savingChanges") : t("editMode")}
        </Button>
      );
    return (
      <Flex>
        <Button
          variant="tertiary"
          startIcon={<Cross />}
          style={{ marginRight: "0.5rem" }}
          disabled={isLoading}
          loading={isLoading}
          onClick={async () => {
            if (
              await showConfirmDialog(
                t("cancelEditMode.willDiscardChanges.confirm.title"),
                t("cancelEditMode.willDiscardChanges.confirm.message")
              )
            ) {
              refreshData();
            }
          }}
        >
          {t("cancelEditMode")}
        </Button>
        <Button
          startIcon={<Check />}
          onClick={saveData}
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? t("savingChanges") : t("saveChanges")}
        </Button>
      </Flex>
    );
  }, [isEditMode, toggleEditMode, isLoading]);

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
      {itemToUpdate ? (
        <EditMenuItemForm onClose={handleFormModalClose} />
      ) : null}
      <Layout>
        <BaseHeaderLayout
          title={t("plugin.name")}
          subtitle={t("description")}
          as="h2"
          primaryAction={<PrimaryActions />}
        />
        <ContentLayout>
          {isLoading && (
            <Flex style={{ justifyContent: "center" }}>
              <Loader />
            </Flex>
          )}
          <EditNewButtons />
          {items.length === 0 && !isLoading ? (
            <EmptyStateLayout
              icon={<Illo />}
              content="Zatím nemate žádné stránky"
            />
          ) : (
            <SortableMenu />
          )}
        </ContentLayout>
      </Layout>
    </>
  );
};

export default HomePage;
