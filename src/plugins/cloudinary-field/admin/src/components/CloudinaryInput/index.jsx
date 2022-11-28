import React from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { pluginId } from "../../pluginId";
import {
  Stack,
  Flex,
  Typography,
  Button,
  ToggleInput,
} from "@strapi/design-system";
import { JSONForm } from "./JSONForm";
import { InputJSONCloudinary } from "./InputJSONCloudinary";
import { useTranslation } from "../../hooks/useTranslation";
import { FieldDescription, FieldLabel } from "./components";

const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const CloudinaryInput = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [cloudinarySettings, setCloudinarySettings] = React.useState(null);
  const [showJson, setShowJson] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(async () => {
    console.log("CloudinaryInput", props);
    try {
      const { data } = await axiosInstance.get(`${pluginId}/config`);
      console.log("response", data);
      setCloudinarySettings(data.body.cloudinary);
    } catch (ex) {
      console.error(ex);
    }
  }, []);

  if (!cloudinarySettings) {
    return <div>you have to setup cloudinary settings </div>;
  }

  const textareaValue =
    typeof props.value === "string"
      ? props.value
      : JSON.stringify(props.value, null, 2);

  let parsedValue = null;

  try {
    parsedValue =
      typeof props.value === "string" ? JSON.parse(props.value) : props.value;
  } catch (err) {
    // console.error(err)
  }

  const isRequired = props.attribute.required;

  const isArrWith0Length =
    Array.isArray(parsedValue) && parsedValue.length === 0;
  const isEmptyObject = isEmpty(parsedValue);

  return (
    <div>
      <Flex
        justifyContent="space-between"
        alignItems="start"
        wrap="wrap"
        style={{ marginBottom: "1rem" }}
      >
        <div style={{ marginRight: "0.5rem" }}>
          <FieldLabel as="label">
            {props.intlLabel?.defaultMessage || props.name}
          </FieldLabel>
          <FieldDescription as="p">
            {props.description?.defaultMessage}
          </FieldDescription>
        </div>
        <ToggleInput
          hint="Change view to"
          onLabel="JSON"
          offLabel="Image"
          size="S"
          checked={showJson}
          onChange={() => setShowJson((prev) => !prev)}
        />
      </Flex>
      {showJson ? (
        <JSONForm {...props} />
      ) : (
        <InputJSONCloudinary
          {...props}
          cloudinarySettings={cloudinarySettings}
        />
      )}
      {props.error && <div style={{ color: "red" }}>{props.error}</div>}

      {isRequired && (isEmptyObject || isArrWith0Length) && (
        <div style={{ color: "red" }}>
          {t("jsonForm.error.fieldIsRequired")}
        </div>
      )}
    </div>
  );
};

export default CloudinaryInput;