import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@strapi/design-system";
import React from "react";
import styled from "styled-components";
import { EditViewContext } from "../../lib/contexts/EditViewContext";

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
    const { isEditMode } = React.useContext(EditViewContext);
    return (
      <Container
        ref={wrapperRef}
        style={{ "--spacing": `${indentationWidth * depth}px` }}
        clone={clone}
        ghost={ghost}
      >
        <Box
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
            <Typography as="h3" style={{ marginLeft: "1rem" }}>
              {value.name}
            </Typography>
          </LeftItemDiv>
          {clone && childCount && childCount > 1 ? (
            <Count>{childCount}</Count>
          ) : null}
        </Box>
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
