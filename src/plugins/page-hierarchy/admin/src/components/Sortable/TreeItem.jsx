import {
  faBookmark,
  faClock,
  faEye,
  faEyeSlash,
  faFile,
  faGripVertical,
  faLink,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Typography, Flex } from "@strapi/design-system";
import React from "react";
import styled from "styled-components";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { ITEM_TYPE } from "../../lib/constants";

import Pencil from "@strapi/icons/Pencil";
import { useConfirmDialog } from "../../lib/contexts/ConfirmDialogContext";
import { useTranslation } from "../../hooks/useTranslation";

const LeftItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Container = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
  padding-left: ${({ clone }) => (clone ? "0.5rem" : "var(--spacing)")};
  padding-top: ${({ clone }) => (clone ? "0.3rem" : "0")};
  max-width: ${({ clone }) => (clone ? "30%" : "100%")};
  max-height: ${({ clone }) => (clone ? "1.2rem" : "100%")};
  opacity: ${({ ghost }) => (ghost ? 0.5 : 1)};
  margin-left: ${({ clone }) => (clone ? "0.2rem" : 0)};
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

const TreeItemBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
export const TreeItem = React.forwardRef(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    const { isEditMode, setItemToUpdate, deleteItem, pages } =
      React.useContext(EditViewContext);
    const { t } = useTranslation();
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

    return (
      <Container
        ref={wrapperRef}
        style={{ "--spacing": `${indentationWidth * depth}px` }}
        clone={clone}
        ghost={ghost}
      >
        <TreeItemBox
          padding={4}
          hasRadius
          background="neutral0"
          shadow="tableShadow"
          ref={ref}
          style={style}
          {...props}
        >
          <LeftItemDiv>
            {isEditMode ? <Handle {...handleProps} /> : null}
            <div style={{ marginLeft: "1rem" }}>
              <Typography as="h3">
                <div>{value.name}</div>
              </Typography>
              <Typography
                as="small"
                style={{ fontSize: "0.7rem", opacity: 0.8 }}
              >
                {havePage && page?.slug}
              </Typography>
            </div>
          </LeftItemDiv>
          {!clone && !ghost ? (
            <Flex>
              <IconWrapper>
                {value.isVisible ? (
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
                {(value.visibleFrom || value.visibleTo) && (
                  <IconButton
                    noBorder
                    label="Časové omezeni"
                    icon={<FontAwesomeIcon icon={faClock} />}
                  ></IconButton>
                )}
                {value.type === ITEM_TYPE.PAGE && (
                  <IconButton
                    noBorder
                    label="Interní stránka"
                    icon={<FontAwesomeIcon icon={faFile} />}
                  ></IconButton>
                )}
                {(value.type === ITEM_TYPE.SYMBOLIC_LINK ||
                  value.type === ITEM_TYPE.URL) && (
                  <IconButton
                    noBorder
                    label="Externí odkaz"
                    icon={<FontAwesomeIcon icon={faLink} />}
                  ></IconButton>
                )}
                {value.type === ITEM_TYPE.LABEL && (
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
                    onClick={handleRemove}
                    label="Smazat"
                    noBorder
                    icon={<FontAwesomeIcon icon={faTrash} />}
                  />
                  <IconButton
                    onClick={() => setItemToUpdate(value)}
                    label="Upravit"
                    noBorder
                    icon={<Pencil />}
                  />
                </>
              ) : null}
            </Flex>
          ) : null}
          {clone && childCount && childCount > 1 ? (
            <Count>{childCount}</Count>
          ) : null}
        </TreeItemBox>
      </Container>
    );
  }
);
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
