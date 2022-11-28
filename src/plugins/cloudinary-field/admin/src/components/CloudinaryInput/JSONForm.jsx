import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { Textarea } from "@strapi/design-system";

export const JSONForm = (props) => {
  const textareaValue =
    typeof props.value === "string"
      ? props.value
      : JSON.stringify(props.value, null, 2);

  const { t } = useTranslation();

  let parsedValue = null;
  let isValid = false;

  try {
    JSON.parse(textareaValue);
    isValid = true;
  } catch (err) {
    // console.error(err)
  }

  return (
    <div>
      <Textarea
        style={{ height: 300 }}
        name={props.name}
        value={textareaValue}
        onChange={(e) => {
          props.onChange({
            target: {
              name: e.target.name,
              value: e.target.value,
              type: "json",
            },
          });
        }}
        error={!isValid ? t("jsonForm.error.invalidJsonFormat") : undefined}
      />
    </div>
  );
};
