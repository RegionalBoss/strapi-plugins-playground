import {
  faBookmark,
  faClock,
  faCopy,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFile,
  faGripVertical,
  faLink,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, Link } from "react-router-dom";

import { Box, IconButton, Typography, Flex } from "@strapi/design-system";
import React from "react";
import styled from "styled-components";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { ITEM_TYPE } from "../../lib/constants";

import Pencil from "@strapi/icons/Pencil";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { useTranslation } from "../../hooks/useTranslation";
import pluginId from "../../pluginId";

import { useDrag, useDrop } from "@regionalboss/react-sortly";

const DETAIL_PATH = `/content-manager/collectionType/plugin::${pluginId}.page`;
const LOCATION_PATH = `/plugins/${pluginId}`;

const LeftItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Container = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
  margin-left: ${({ depth }) => `${depth * 30}px`};
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
`;

const UpdateIconButton = styled(IconButton)`
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

export const TreeItem = React.memo((props) => {
  const { depth } = props;

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
    () => props.type === ITEM_TYPE.PAGE,
    [props.type]
  );
  const page = React.useMemo(
    () => (havePage ? pages.find((page) => page.id === props.pageId) : null),
    [havePage, props.pageId, pages]
  );

  const handleRemove = async () => {
    if (
      await showConfirmDialog(
        t("EditMenuItemForm.delete.warning.confirm.title"),
        t("EditMenuItemForm.delete.warning.confirm.message")
      )
    )
      deleteItem(props);
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
        <IconButton
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
  }, [havePage, page, isEditMode, handleEditPageClick]);

  const handleDuplicateItem = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let itemIdToDuplicate = props.id;

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

  // DnD for Sortly
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop();

  return (
    <Container
      ref={(ref) => drop(preview(ref))}
      depth={depth}
      isDragging={isDragging}
    >
      <TreeItemBox
        padding={4}
        hasRadius
        background="neutral0"
        shadow="tableShadow"
        {...props}
      >
        <LeftItemDiv>
          <Handle
            style={{
              opacity: isEditMode ? 1 : 0.2,
              cursor: isEditMode ? "grab" : "default",
            }}
            disabled={!isEditMode}
            ref={drag}
          />
          <div style={{ marginLeft: "1rem" }}>
            <Typography as="h3">
              <div>{props.name}</div>
            </Typography>
            <Typography as="small" style={{ fontSize: "0.7rem", opacity: 0.8 }}>
              {havePage && page?.slug}
            </Typography>
          </div>
        </LeftItemDiv>
        <Flex>
          <UpdatePageButton />
          <IconWrapper>
            {props.isVisible ? (
              <IconButton
                noBorder
                label="Viditelné"
                icon={<FontAwesomeIcon icon={faEye} />}
              />
            ) : (
              <IconButton
                noBorder
                label="Neviditelné"
                icon={<FontAwesomeIcon icon={faEyeSlash} />}
              ></IconButton>
            )}
            {(props.visibleFrom || props.visibleTo) && (
              <IconButton
                noBorder
                label="Časové omezeni"
                icon={<FontAwesomeIcon icon={faClock} />}
              ></IconButton>
            )}
            {props.type === ITEM_TYPE.PAGE && (
              <IconButton
                noBorder
                label="Interní stránka"
                icon={<FontAwesomeIcon icon={faFile} />}
              ></IconButton>
            )}
            {(props.type === ITEM_TYPE.SYMBOLIC_LINK ||
              props.type === ITEM_TYPE.URL) && (
              <IconButton
                noBorder
                label="Externí odkaz"
                icon={<FontAwesomeIcon icon={faLink} />}
              ></IconButton>
            )}
            {props.type === ITEM_TYPE.LABEL && (
              <IconButton
                noBorder
                label="Označení"
                icon={<FontAwesomeIcon icon={faBookmark} />}
              ></IconButton>
            )}
          </IconWrapper>
          {isEditMode ? (
            <>
              <IconButton
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
              <IconButton
                onClick={() => setItemToUpdate(props)}
                label="Upravit"
                style={{ marginRight: "0.5rem" }}
                noBorder
                icon={<Pencil />}
              />
              <IconButton
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
      </TreeItemBox>
    </Container>
  );
});

const Handle = React.forwardRef((props, ref) => {
  return (
    <button
      ref={ref}
      style={{ ...props.style, cursor: "grab" }}
      data-cypress="draggable-handle"
      {...props}
    >
      <Typography
        as="span"
        style={{
          fontSize: "0.8rem",
          padding: "0 0.5rem",
        }}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </Typography>
    </button>
  );
});
