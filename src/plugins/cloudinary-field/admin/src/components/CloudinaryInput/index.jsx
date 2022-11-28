import React from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { pluginId } from "../../pluginId";
import { Stack, Typography, Button } from "@strapi/design-system";
import { JSONForm } from "./JSONForm";
import { InputJSONCloudinary } from "./InputJSONCloudinary";
import { useTranslation } from "../../hooks/useTranslation";

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
      <div style={{ marginBottom: "2rem" }}>
        <div>
          <Typography as="label">{props.label || props.name}</Typography>
        </div>

        <Typography>{props.description}</Typography>
      </div>
      <Button
        variant="secondary"
        type="button"
        onClick={() => setShowJson((prev) => !prev)}
        style={{ marginBottom: "1rem" }}
      >
        Change view to {showJson ? "Image" : "Json"}
      </Button>
      <Stack>
        {showJson ? (
          <JSONForm {...props} />
        ) : (
          <InputJSONCloudinary
            {...props}
            cloudinarySettings={cloudinarySettings}
          />
        )}
      </Stack>
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
