import React, { useState, useEffect } from "react";
import { Button, Flex } from "@strapi/design-system";
import { Wrapper } from "./components";
import { FileCard } from "./FileCard";

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
      <Flex>
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
          <Button variant="primary" onClick={handleRemoveAllFiles}>
            Odstranit vše
          </Button>
        )}
      </Flex>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {Array.isArray(files) &&
          files.map((image, index) => {
            const {
              secure_url: url,
              public_id,
              resource_type,
              type,
              format,
              context: { custom: { alt = "", caption = "" } = {} } = {},
            } = image;
            return (
              // <span
              //   key={`${index}-${public_id}`}
              // >{`${index}-${public_id}`}</span>
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
                  public_id,
                  handleInputChange,
                  alt,
                  caption,
                  index,
                }}
              />
            );
          })}
      </div>
    </Wrapper>
  );
};
