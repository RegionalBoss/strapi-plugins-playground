/*
 *
 * HomePage
 *
 */

import { BaseHeaderLayout, Button, Flex, Loader } from "@strapi/design-system";
import Check from "@strapi/icons/Check";
import Cross from "@strapi/icons/Cross";
import Pencil from "@strapi/icons/Pencil";
import styled from "styled-components";
import React from "react";
import { SortableMenu } from "../../components/Sortable/SortableMenu";
import { useTranslation } from "../../hooks/useTranslation";
import { ITEM_TYPE } from "../../lib/constants";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { EditMenuItemForm } from "../../components/EditMenuItemForm";

const Layout = styled.div``;

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

const PrimaryActions = () => {
  const { isEditMode, toggleEditMode, saveData, refreshData, isLoading } =
    React.useContext(EditViewContext);

  const { showConfirmDialog } = useConfirmDialog();
  const { t } = useTranslation();

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
};

const ItemsList = ({ items, setItems }) => {
  return <SortableMenu items={items} setItems={setItems} />;
};

const StyledContent = styled.div`
  display: flex;
  padding: 0;
  overflow: hidden;
`;

const HomePage = () => {
  const { isLoading, items, setItems, addNewItem, isEditMode, selectedItemId } =
    React.useContext(EditViewContext);
  const { t } = useTranslation();

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
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <StyledContent>
          <div style={{ overflowY: "auto", flex: 1, padding: "0 1rem" }}>
            <BaseHeaderLayout
              title={t("plugin.name")}
              subtitle={t("description")}
              as="h2"
              primaryAction={<PrimaryActions />}
            />
            {isLoading && (
              <Flex style={{ justifyContent: "center" }}>
                <Loader />
              </Flex>
            )}
            <EditNewButtons />
            <ItemsList
              items={items}
              isLoading={isLoading}
              setItems={setItems}
            />
          </div>
          {selectedItemId ? <EditMenuItemForm /> : null}
        </StyledContent>
      </Layout>
    </>
  );
};

export default HomePage;
