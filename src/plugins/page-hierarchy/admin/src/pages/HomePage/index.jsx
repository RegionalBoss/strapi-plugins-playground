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
} from "@strapi/design-system";
import Check from "@strapi/icons/Check";
import Cross from "@strapi/icons/Cross";
import Pencil from "@strapi/icons/Pencil";
import React from "react";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { SortableMenu } from "../../components/Sortable/SortableMenu";
import { useTranslation } from "../../hooks/useTranslation";
import { ITEM_TYPE } from "../../lib/constants";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { Illo } from "../../components/Illo";
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
    globalLoading,
    items,
    isLoading,
  } = React.useContext(EditViewContext);
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
          disabled={globalLoading}
          loading={globalLoading}
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
          onClick={saveData}
          disabled={globalLoading}
          loading={globalLoading}
        >
          {globalLoading ? t("savingChanges") : t("saveChanges")}
        </Button>
      </Flex>
    );
  }, [isEditMode, toggleEditMode, globalLoading]);

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

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <>
      <Layout>
        <BaseHeaderLayout
          title={t("plugin.name")}
          subtitle={t("description")}
          as="h2"
          primaryAction={<PrimaryActions />}
        />
        <ContentLayout>
          <EditNewButtons />
          {items.length === 0 ? (
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
