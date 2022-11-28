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

export const FileCard = React.forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const elementRef = useRef(null);

    return (
      <FileWrapper ref={elementRef}>
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
      </FileWrapper>
    );
  }
);
