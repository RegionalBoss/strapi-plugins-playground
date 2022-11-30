import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
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

import { useSortable } from "@dnd-kit/sortable";

export const FileCard = React.forwardRef(
  (
    {
      id,
      public_id,
      url,
      format,
      created_at,
      removeItem,
      clickItem,
      alt,
      caption,
      handleInputChange,
      index,
      clone,
      ghost,
    },
    ref
  ) => {
    const elementRef = useRef(null);

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      cursor: clone ? "grabbing" : "grab",
      opacity: ghost ? 0.2 : 1,
      boxShadow: clone ? "0px 15px 15px 0px black" : "none",
      transform: clone ? "scale(1.01)" : undefined,
    };

    const isDragging = React.useMemo(() => ghost || clone, [ghost, clone]);

    return (
      <FileWrapper
        ref={setNodeRef}
        style={style}
        ghost
        clone
        transform={transform}
        transition={transition}
      >
        <Card ref={elementRef} style={{ height: "100%" }}>
          <CardHeader>
            <FileLink href={url} target="_blank" rel="noopener noreferrer">
              <CardAsset
                src={PREVIEW_FORMATS.includes(format) ? url : undefined}
              />
              <CardTimer>
                {formatDate(new Date(created_at), "dd.MM.yyyy HH:mm:ss")}
              </CardTimer>
            </FileLink>
            <CardAction position="end">
              <div {...attributes} {...listeners}>
                <IconButton
                  style={{ cursor: clone ? "grabbing" : "grab" }}
                  icon={<FontAwesomeIcon icon={faGripVertical} />}
                />
              </div>
            </CardAction>
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
                  disabled={isDragging}
                  onChange={(e) =>
                    handleInputChange(e, index, "context.custom.caption")
                  }
                />
                <TextInput
                  value={alt}
                  id="alt"
                  name="alt"
                  label="alt"
                  disabled={isDragging}
                  onChange={(e) =>
                    handleInputChange(e, index, "context.custom.alt")
                  }
                />
                <Flex style={{ marginTop: "0.5rem" }} justifyContent="end">
                  <IconButton
                    label="Editovat"
                    onClick={clickItem}
                    disabled={isDragging}
                    icon={<FontAwesomeIcon icon={faPencilAlt} />}
                    style={{ marginRight: "1rem" }}
                  />

                  <IconButton
                    label="Odstranit"
                    disabled={isDragging}
                    onClick={removeItem}
                    icon={<FontAwesomeIcon icon={faTrash} />}
                  />
                </Flex>
              </CardSubtitle>
            </CardContent>
            <CardBadge>{format}</CardBadge>
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
        </Card>
      </FileWrapper>
    );
  }
);
