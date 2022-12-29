import {
  faBookmark,
  faClock,
  faCopy,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFile,
  faLink,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@strapi/design-system";
import { Link, useHistory } from "react-router-dom";

import { Box, Flex, IconButton, Typography } from "@strapi/design-system";
import React from "react";
import styled from "styled-components";
import { ITEM_TYPE } from "../../lib/constants";
import { EditViewContext } from "../../lib/contexts/EditViewContext";

import Pencil from "@strapi/icons/Pencil";
import { useTranslation } from "../../hooks/useTranslation";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import pluginId from "../../pluginId";

const DETAIL_PATH = `/content-manager/collectionType/plugin::${pluginId}.page`;
const LOCATION_PATH = `/plugins/${pluginId}`;

const StyledIconButton = styled(IconButton)`
  background: none;
  :hover {
    cursor: pointer;
  }
`;

const LeftItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Count = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary600};
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
`;

const UpdateIconButton = styled(StyledIconButton)`
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }

  svg path,
  &:hover svg path {
    fill: ${({ theme }) => theme.colors.primary600};
  }
`;

const TreeItemBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: box-shadow 0.2s;

  &:hover {
    -webkit-box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    -moz-box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  margin-right: 1rem;

  button {
    cursor: initial;
    opacity: 0.4;
    transition: opacity 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }
  }

  svg {
    margin: 10px;
  }
`;

export const TreeItem = ({ value }) => {
  const { colors, shadows, spaces } = useTheme();
  const {
    isEditMode,
    setItemToUpdate,
    deleteItem,
    pages,
    saveDataAndPickById,
    duplicateItem,
  } = React.useContext(EditViewContext);
  const { t } = useTranslation();
  const history = useHistory();
  const { showConfirmDialog } = useConfirmDialog();

  const havePage = React.useMemo(
    () => value.type === ITEM_TYPE.PAGE,
    [value.type]
  );
  const page = React.useMemo(
    () => (havePage ? pages.find((page) => page.id === value.pageId) : null),
    [havePage, value.pageId, pages]
  );

  const handleRemove = async () => {
    if (
      await showConfirmDialog(
        t("EditMenuItemForm.delete.warning.confirm.title"),
        t("EditMenuItemForm.delete.warning.confirm.message")
      )
    )
      deleteItem(value);
  };

  const handleEditPageClick = async (e) => {
    // magic complicated function
    // tricky validate link that can handle logic if redirect is valid
    // validate if link can be used

    if (page._feGenerated) {
      e.preventDefault();
      e.stopPropagation();

      const saveDataAndRedirect = await showConfirmDialog(
        t("PageHierarchyEditor.update.button.confirm.haveToSave.header"),
        t("PageHierarchyEditor.update.button.confirm.haveToSave.body")
      );

      if (!saveDataAndRedirect) {
        return;
      }

      // ID does not exist so we have to redirect by our own
      const dbPageId = await saveDataAndPickById(page.id, "page");
      history.push(`${DETAIL_PATH}/${dbPageId}?redirectUrl=${LOCATION_PATH}`);
      return;
    }

    if (!isEditMode) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const shouldContinue = await showConfirmDialog(
      t("PageHierarchyEditor.update.button.confirm.willDiscardChanges.header"),
      t("PageHierarchyEditor.update.button.confirm.willDiscardChanges.body")
    );
    if (shouldContinue) {
      const redirectUrl = `${DETAIL_PATH}/${page.id}?redirectUrl=${LOCATION_PATH}`;
      history.push(redirectUrl);
    }
  };

  const UpdatePageButton = React.useCallback(() => {
    if (!havePage) return null;
    if (!page)
      return (
        <StyledIconButton
          noBorder
          label={t("PageHierarchyEditor.pageDoesNotExists.warning")}
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
        />
      );
    return (
      <Link
        to={`${DETAIL_PATH}/${page.id}?redirectUrl=${LOCATION_PATH}`}
        onClick={handleEditPageClick}
      >
        <UpdateIconButton
          noBorder
          label={t("PageHierarchyEditor.update.button.page")}
          icon={<FontAwesomeIcon icon={faPen} />}
        />
      </Link>
    );
  }, [havePage, page, isEditMode, value, handleEditPageClick]);

  const handleDuplicateItem = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let itemIdToDuplicate = value.id;

    // special FE-x-BE case where we have to sync data with database
    if (havePage && page._feGenerated) {
      const saveDataAndDuplicate = await showConfirmDialog(
        t(
          "PageHierarchyEditor.update.duplicatePageItem.button.haveToSave.confirm.title"
        ),
        t(
          "PageHierarchyEditor.update.duplicatePageItem.button.haveToSave.confirm.message"
        )
      );
      if (!saveDataAndDuplicate) return;
      itemIdToDuplicate = await saveDataAndPickById(item.id);
    }

    duplicateItem(itemIdToDuplicate);
  };

  return (
    <Flex
      justifyContent="space-between"
      style={{
        backgroundColor: colors.neutral100,
        color: "white",
        boxShadow: shadows.tableShadow,
        // boxShadow: "box-shadow: 15px 15px 15px 0px rgba(3, 3, 5, 0.2);",
        padding: spaces[2],
        marginBottom: spaces[2],
      }}
    >
      <LeftItemDiv>
        <div style={{ marginLeft: "1rem" }}>
          <Typography as="h3">
            <div>{value.name}</div>
          </Typography>
          <Typography as="small" style={{ fontSize: "0.7rem", opacity: 0.8 }}>
            {havePage && page?.slug}
          </Typography>
        </div>
      </LeftItemDiv>
      <Flex>
        <UpdatePageButton />
        <IconWrapper>
          {value.isVisible ? (
            <StyledIconButton
              noBorder
              label="Viditelné"
              icon={<FontAwesomeIcon icon={faEye} />}
            />
          ) : (
            <StyledIconButton
              noBorder
              label="Neviditelné"
              icon={<FontAwesomeIcon icon={faEyeSlash} />}
            ></StyledIconButton>
          )}
          {(value.visibleFrom || value.visibleTo) && (
            <StyledIconButton
              noBorder
              label="Časové omezeni"
              icon={<FontAwesomeIcon icon={faClock} />}
            ></StyledIconButton>
          )}
          {value.type === ITEM_TYPE.PAGE && (
            <StyledIconButton
              noBorder
              label="Interní stránka"
              icon={<FontAwesomeIcon icon={faFile} />}
            ></StyledIconButton>
          )}
          {(value.type === ITEM_TYPE.SYMBOLIC_LINK ||
            value.type === ITEM_TYPE.URL) && (
            <StyledIconButton
              noBorder
              label="Externí odkaz"
              icon={<FontAwesomeIcon icon={faLink} />}
            ></StyledIconButton>
          )}
          {value.type === ITEM_TYPE.LABEL && (
            <StyledIconButton
              noBorder
              label="Označení"
              icon={<FontAwesomeIcon icon={faBookmark} />}
            ></StyledIconButton>
          )}
        </IconWrapper>
        {isEditMode ? (
          <>
            <StyledIconButton
              disabled={havePage && !page}
              onClick={handleDuplicateItem}
              label={t(
                havePage
                  ? page
                    ? "PageHierarchyEditor.update.duplicatePageItem.button"
                    : "PageHierarchyEditor.update.duplicate.pendingSave.warning.button"
                  : "PageHierarchyEditor.update.duplicateNonPageItem.button"
              )}
              style={{ marginRight: "0.5rem" }}
              noBorder
              icon={<FontAwesomeIcon icon={faCopy} />}
            />
            <StyledIconButton
              onClick={() => setItemToUpdate(value)}
              label="Upravit"
              style={{ marginRight: "0.5rem" }}
              noBorder
              icon={<Pencil />}
            />
            <StyledIconButton
              onClick={handleRemove}
              label={
                havePage
                  ? t("EditMenuItemForm.delete.itemAndPage")
                  : t("EditMenuItemForm.delete.item")
              }
              noBorder
              icon={<FontAwesomeIcon icon={faTrash} />}
            />
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};
