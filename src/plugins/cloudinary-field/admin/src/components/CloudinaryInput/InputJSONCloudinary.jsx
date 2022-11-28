import React, { useState, useEffect } from "react";
import { Button, Flex } from "@strapi/design-system";
import { Wrapper } from "./components";
import { FileCard } from "./FileCard";
import { createPortal } from "react-dom";

import {
  Active,
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  KeyboardSensor,
  KeyboardCoordinateGetter,
  Modifiers,
  MouseSensor,
  MeasuringConfiguration,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  PointerSensor,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
  NewIndexGetter,
} from "@dnd-kit/sortable";

import { set } from "lodash";

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

  const [activeId, setActiveId] = (useState < UniqueIdentifier) | (null > null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getIndex = (id) => files.findIndex((file) => file.public_id === id);
  const getPosition = (id) => getIndex(id) + 1;
  const activeIndex = activeId ? getIndex(activeId) : -1;

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

  const handleFileMove = (dragIndex, dropIndex) => {
    setFiles((prevState) => {
      const removedItem = prevState.splice(dragIndex, 1);
      prevState.splice(dropIndex, 0, removedItem[0]);
      return [...prevState];
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
        onDragStart={({ active }) => {
          if (!active) {
            return;
          }

          setActiveId(active.id);
        }}
        onDragEnd={({ over }) => {
          setActiveId(null);

          if (over) {
            const overIndex = getIndex(over.id);
            if (activeIndex !== overIndex) {
              setFiles((prev) => arrayMove(prev, activeIndex, overIndex));
            }
          }
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <SortableContext
            items={files.map((file) => file.public_id)}
            strategy={rectSortingStrategy}
          >
            {Array.isArray(files) &&
              files.map(
                (
                  {
                    secure_url: url,
                    public_id,
                    resource_type,
                    type,
                    format,
                    created_at,
                    context: { custom: { alt = "", caption = "" } = {} } = {},
                  },
                  index
                ) => (
                  <FileCard
                    key={`${index}-${public_id}`}
                    removeItem={(e) => {
                      e.preventDefault();
                      handleFileRemove(index);
                    }}
                    moveItem={handleFileMove}
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
                      resource_type,
                      public_id,
                      handleInputChange,
                      alt,
                      caption,
                      index,
                    }}
                  />
                )
              )}
          </SortableContext>
        </div>
      </DndContext>
    </Wrapper>
  );
};
