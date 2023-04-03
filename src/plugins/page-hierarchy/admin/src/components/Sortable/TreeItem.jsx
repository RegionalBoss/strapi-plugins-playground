import {
  faBookmark,
  faClock,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFile,
  faGripVertical,
  faLink,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Typography,
} from "@strapi/design-system";
import React from "react";
import styled from "styled-components";
import { ITEM_TYPE } from "../../lib/constants";
import { EditViewContext } from "../../lib/contexts/EditViewContext";

import { useTranslation } from "../../hooks/useTranslation";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
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
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary600 : "transparent"};
  /* opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)}; */
`;

const UpdateIconButton = styled(Button)`
  text-decoration: none;

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
  cursor: pointer;

  &:hover {
    -webkit-box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    -moz-box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    background-color: ${({ theme }) => theme.colors.neutral150};
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

const ActionButtons = React.memo(
  ({ props, havePage, page, handleEditPageClick }) => {
    const { t } = useTranslation();

    return (
      <Flex>
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
        {havePage ? (
          !page ? (
            <IconButton
              noBorder
              label={t("PageHierarchyEditor.pageDoesNotExists.warning")}
              icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
            />
          ) : (
            <Link
              to={`${DETAIL_PATH}/${page?.id}?redirectUrl=${LOCATION_PATH}`}
              onClick={handleEditPageClick}
              style={{
                textDecoration: "none",
              }}
            >
              <UpdateIconButton
                variant="secondary"
                label={t("PageHierarchyEditor.update.button.page")}
                style={{ marginRight: "0.5rem" }}
                noBorder
                startIcon={<FontAwesomeIcon icon={faPen} />}
              >
                {t("PageHierarchyEditor.update.button.page")}
              </UpdateIconButton>
            </Link>
          )
        ) : null}
      </Flex>
    );
  }
);

export const TreeItem = React.memo((props) => {
  const { depth } = props;

  const {
    isEditMode,
    pages,
    saveDataAndPickById,
    setSelectedItemId,
    selectedItemId,
  } = React.useContext(EditViewContext);
  const { t } = useTranslation();
  const history = useHistory();
  const { showConfirmDialog } = useConfirmDialog();

  const havePage = props.type === ITEM_TYPE.PAGE;

  const page = havePage
    ? pages.find((page) => page?.id === props.pageId)
    : null;

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
      const dbPageId = await saveDataAndPickById(page?.id, "page");
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
      const redirectUrl = `${DETAIL_PATH}/${page?.id}?redirectUrl=${LOCATION_PATH}`;
      history.push(redirectUrl);
    }
  };

  // DnD for Sortly
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop();

  return (
    <div ref={(ref) => drop(preview(ref))}>
      <Container
        depth={depth}
        isDragging={isDragging}
        selected={selectedItemId?.id === props?.id}
      >
        <TreeItemBox
          padding={4}
          hasRadius
          background="neutral0"
          shadow="tableShadow"
          onMouseUp={() => {
            if (isDragging) return;
            setSelectedItemId(props.id);
          }}
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
              <Typography
                as="small"
                style={{ fontSize: "0.7rem", opacity: 0.8 }}
              >
                {havePage && page?.slug}
              </Typography>
            </div>
          </LeftItemDiv>
          <ActionButtons
            props={props}
            havePage={havePage}
            page={page}
            isEditMode={isEditMode}
            handleEditPageClick={handleEditPageClick}
          />
        </TreeItemBox>
      </Container>
    </div>
  );
});

const Handle = React.forwardRef((props, ref) => {
  return (
    <button
      ref={ref}
      style={{ ...props.style }}
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
