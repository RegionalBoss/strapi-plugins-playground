import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@strapi/design-system";
import React from "react";
import styled from "styled-components";

const LeftItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const animateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

export const SortableMenuItem = ({ id, depth, ...props }) => {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
};

const TreeItem = React.forwardRef(
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
    return (
      <div
        ref={wrapperRef}
        style={{
          marginBottom: "0.5rem",
          "--spacing": `${indentationWidth * depth}px`,
          paddingLeft: clone ? "0.5rem" : "var(--spacing)",
          paddingTop: clone ? "0.3rem" : "0",
          maxWidth: clone ? "30%" : "100%",
          maxHeight: clone ? "1.2rem" : "100%",
          opacity: ghost ? 0.5 : 1,
          marginLeft: clone ? "0.2rem" : 0,
        }}
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
            <Handle {...handleProps}></Handle>
            <Typography as="h3" style={{ marginLeft: "1rem" }}>
              {value}
            </Typography>
          </LeftItemDiv>
        </Box>
      </div>
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
