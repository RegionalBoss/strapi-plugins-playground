import React, { useState, useEffect, useRef } from "react";
import { FileLink, ActionButton, FileWrapper, File } from "./components";
import { TextInput } from "@strapi/design-system";

export const FileCard = React.forwardRef(
  (
    {
      public_id,
      url,
      format,
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
      <FileWrapper
        ref={elementRef}
        url={url}
        style={{
          border: "1px dashed gray",
          margin: "1rem 0rem",
          cursor: "move",
        }}
      >
        <FileLink href={url} target="_blank" rel="noopener noreferrer">
          <File {...{ format, url }} />
        </FileLink>
        <div
          style={{
            wordBreak: "break-all",
            fontSize: "10px",
            lineHeight: 1,
            margin: "5px auto",
          }}
        >
          {public_id}
        </div>
        <label>
          Caption
          <TextInput
            value={caption}
            id="caption"
            name="caption"
            label="caption"
            onChange={(e) =>
              handleInputChange(e, index, "context.custom.caption")
            }
          />
        </label>
        <label>
          Alt
          <TextInput
            value={alt}
            id="alt"
            name="alt"
            label="alt"
            onChange={(e) => handleInputChange(e, index, "context.custom.alt")}
          />
        </label>
        <ActionButton secondary onClick={clickItem}>
          Editovat obrázek
        </ActionButton>
        <ActionButton secondary onClick={removeItem}>
          Odstranit
        </ActionButton>
      </FileWrapper>
    );
  }
);
