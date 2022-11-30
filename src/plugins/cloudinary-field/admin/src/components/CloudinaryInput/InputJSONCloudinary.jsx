import React, { useState, useEffect } from "react";
import { Button, Flex } from "@strapi/design-system";
import { Wrapper } from "./components";
import { FileCard } from "./FileCard";
import { set } from "lodash";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { createPortal } from "react-dom";

let outerExternalScriptLoaded = false;

const externalScriptLoadedEvent = new window.Event("loadExternalScript");
const head = document.getElementsByTagName("head")[0];
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://media-library.cloudinary.com/global/all.js";
script.onload = () => {
  document.dispatchEvent(externalScriptLoadedEvent);
};
head.appendChild(script);

document.addEventListener(
  "loadExternalScript",
  () => (outerExternalScriptLoaded = true)
);

export const InputJSONCloudinary = (props) => {
  let files = [];
  try {
    files =
      (typeof props.value === "string"
        ? JSON.parse(props.value)
        : props.value) || [];
  } catch (err) {}

  const [externalScriptLoaded, setExternalScriptLoaded] = useState(
    outerExternalScriptLoaded
  );

  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cloudinaryConfig = {
    // TODO: add key mapper or prop types
    ...props.cloudinarySettings,
    button_class: "open-btn",
    button_caption: "Insert Images",
  };

  const setFiles = (getFiles) => {
    const _files = getFiles(files);

    props.onChange({
      target: {
        name: props.name,
        value: _files.length === 0 ? "[]" : JSON.stringify(_files, null, 2),
        type: "json",
      },
    });
  };

  React.useEffect(() => {
    document.addEventListener(
      "loadExternalScript",
      setExternalScriptLoaded(true)
    );

    return document.removeEventListener(
      "loadExternalScript",
      setExternalScriptLoaded(true),
      true
    );
  }, []);

  const handleChange = (newFiles) =>
    setFiles((prevFiles) => {
      const pFiles = Array.isArray(prevFiles) ? prevFiles : [];
      return [...pFiles, ...newFiles];
    });

  const handleCloudinaryInsert = async () => {
    try {
      // TODO: add iframe loading
      window.cloudinary.openMediaLibrary(cloudinaryConfig, {
        insertHandler: (data) => handleChange(data.assets),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileClick = async (currentImageConfig) => {
    const { asset } = currentImageConfig;
    try {
      window.cloudinary.openMediaLibrary(
        {
          ...cloudinaryConfig,
          asset,
        },
        {
          insertHandler: (data) => handleChange(data.assets),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveAllFiles = (e) => {
    e.preventDefault();

    if (files.length === 0) {
      return;
    }

    const confirmed = window.confirm("Opravdu vše smazat?");
    if (confirmed === true) {
      setFiles(() => []);
    }
  };

  const handleInputChange = (e, changedIndex, propertyPath) => {
    const { value } = e.target;

    const changeObject = files[changedIndex];
    set(changeObject, propertyPath, value);

    setFiles((prevFiles) => {
      const newState = Object.assign([...prevFiles], {
        [changedIndex]: { ...prevFiles[changedIndex], ...changeObject },
      });
      return newState;
    });
  };

  const handleFileRemove = (removeIndex) => {
    setFiles((prevState) =>
      prevState.filter((item, index) => index !== removeIndex)
    );
  };

  return (
    <Wrapper>
      <Flex style={{ marginBottom: "1rem" }}>
        <Button
          variant="primary"
          onClick={handleCloudinaryInsert}
          style={{ marginRight: "1rem" }}
          disabled={
            !externalScriptLoaded && cloudinaryConfig && !props.disabled
          }
        >
          {externalScriptLoaded && cloudinaryConfig
            ? "Přidat soubor"
            : "Načítám Cloudinary"}
        </Button>
        {files.length > 0 && (
          <Button variant="secondary" onClick={handleRemoveAllFiles}>
            Odstranit vše
          </Button>
        )}
      </Flex>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragState}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveItem(null)}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <SortableContext
            items={Array.isArray(files) ? files : []}
            strategy={verticalListSortingStrategy}
          >
            {Array.isArray(files) &&
              files.map((image, index) => {
                const {
                  secure_url: url,
                  public_id,
                  resource_type,
                  type,
                  format,
                  created_at,
                  context: { custom: { alt = "", caption = "" } = {} } = {},
                } = image;
                return (
                  // <span
                  //   key={`${index}-${public_id}`}
                  // >{`${index}-${public_id}`}</span>
                  <FileCard
                    key={`${index}-${public_id}`}
                    id={public_id}
                    ghost={activeItem?.public_id === public_id}
                    removeItem={(e) => {
                      e.preventDefault();
                      handleFileRemove(index);
                    }}
                    clickItem={(e) => {
                      e.preventDefault();
                      handleFileClick({
                        asset: {
                          resource_id: `${resource_type}/${type}/${public_id}`,
                        },
                      });
                    }}
                    {...{
                      url,
                      format,
                      created_at,
                      public_id,
                      handleInputChange,
                      alt,
                      caption,
                      index,
                    }}
                  />
                );
              })}
            {createPortal(
              <DragOverlay>
                {activeItem ? (
                  <FileCard
                    clone
                    id={activeItem.public_id}
                    {...activeItem}
                    url={activeItem.secure_url}
                    {...activeItem.context.custom}
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </SortableContext>
        </div>
      </DndContext>
    </Wrapper>
  );

  function handleDragState({ active }) {
    if (!active) {
      return;
    }

    setActiveItem(files.find((file) => file.public_id === active.id));
  }

  function handleDragEnd(event) {
    setActiveItem(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setFiles((prevFiles) => {
        const oldIndex = prevFiles.findIndex(
          (file) => file.public_id === active.id
        );
        const newIndex = prevFiles.findIndex(
          (file) => file.public_id === over.id
        );

        return arrayMove(prevFiles, oldIndex, newIndex);
      });
    }
  }
};
