import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  FileLink,
  ActionButton,
  File,
  PREVIEW_FORMATS,
  FileWrapper,
} from "./components";
import formatDate from "date-fns/format";
import {
  TextInput,
  Flex,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardCheckbox,
  CardAction,
  CardAsset,
  CardTimer,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system";

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
  ...props
}) => {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <FileCard
      ref={setNodeRef}
      value={id}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={
        handle
          ? {
              ref: setActivatorNodeRef,
            }
          : undefined
      }
      renderItem={renderItem}
      index={index}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
};

export const FileCard = React.memo(
  React.forwardRef(
    (
      {
        public_id,
        url,
        format,
        resource_type,
        created_at,
        removeItem,
        clickItem,
        alt,
        caption,
        handleInputChange,
        index,
        ...props
      },
      ref
    ) => {
      return (
        <FileWrapper>
          <CardHeader>
            <FileLink href={url} target="_blank" rel="noopener noreferrer">
              <CardAsset
                src={PREVIEW_FORMATS.includes(format) ? url : undefined}
              />
              <CardTimer>
                {formatDate(new Date(created_at), "dd.MM.yyyy HH:mm:ss")}
              </CardTimer>
            </FileLink>
          </CardHeader>
          {/* <FileLink href={url} target="_blank" rel="noopener noreferrer">
          <File {...{ format, url }} />
        </FileLink> */}
          <CardBody>
            <CardContent>
              <CardTitle style={{ marginBottom: "0.5rem" }}>
                {public_id}
              </CardTitle>
              <CardSubtitle>
                <TextInput
                  value={caption}
                  id="caption"
                  name="caption"
                  label="caption"
                  onChange={(e) =>
                    handleInputChange(e, index, "context.custom.caption")
                  }
                />
                <TextInput
                  value={alt}
                  id="alt"
                  name="alt"
                  label="alt"
                  onChange={(e) =>
                    handleInputChange(e, index, "context.custom.alt")
                  }
                />
                <Flex style={{ marginTop: "0.5rem" }} justifyContent="end">
                  <IconButton
                    label="Editovat"
                    onClick={clickItem}
                    icon={<FontAwesomeIcon icon={faPencilAlt} />}
                    style={{ marginRight: "1rem" }}
                  />

                  <IconButton
                    label="Odstranit"
                    onClick={removeItem}
                    icon={<FontAwesomeIcon icon={faTrash} />}
                  />
                </Flex>
              </CardSubtitle>
            </CardContent>
            <CardBadge>{format || resource_type}</CardBadge>
          </CardBody>
          {/* <div
          style={{
            wordBreak: "break-all",
            fontSize: "10px",
            lineHeight: 1,
            margin: "5px auto",
          }}
        >
          {public_id}
        </div> */}
        </FileWrapper>
      );
    }
  )
);
