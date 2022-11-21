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
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";

const HomePage = () => {
  const { isEditMode, toggleEditMode } = React.useContext(EditViewContext);
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
          onClick={async () =>
            (await showConfirmDialog(
              t("cancelEditMode.willDiscardChanges.confirm.title"),
              t("cancelEditMode.willDiscardChanges.confirm.message")
            ))
              ? toggleEditMode()
              : null
          }
        >
          {t("cancelEditMode")}
        </Button>
        <Button startIcon={<Check />} onClick={toggleEditMode}>
          {t("saveChanges")}
        </Button>
      </Flex>
    );
  }, [isEditMode, toggleEditMode]);

  return (
    <>
      <BaseHeaderLayout
        title={t("plugin.name")}
        subtitle={t("description")}
        as="h2"
        primaryAction={<PrimaryActions />}
      />
      <ContentLayout>
        <SortableMenu />
      </ContentLayout>
    </>
  );
};

export default HomePage;
