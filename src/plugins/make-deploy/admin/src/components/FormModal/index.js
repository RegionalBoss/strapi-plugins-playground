import React, { useState, useCallback } from "react";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Box,
  Loader,
  Select,
  Option,
} from "@strapi/design-system";
import { settingsRequests } from "../../api/settings";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotification } from "@strapi/helper-plugin";
import { axiosInstance } from "../../utils/axiosInstance";
import { useRoles } from "../../hooks/useRoles";

const FORM_VALUES = [
  {
    name: "name",
    required: true,
    placeholder: "Název prostředí",
    label: "Nazev",
    hint: "Název prostředí",
  },
  {
    name: "deploy",
    required: true,
    placeholder: "Url pro nasazeni",
    label: "URL nasazeni",
    hint: "Url pro nasazeni",
  },
  {
    name: "link",
    required: true,
    placeholder: "Url pro přechod na náhled",
    label: "URL odkazu",
    hint: "Url pro přechod na náhled",
  },
];

export const FormModal = ({
  handleClose,
  isOpen,
  values = {},
  isUpdate,
  ...props
}) => {
  const { formatMessage } = useTranslation();
  const [status, setStatus] = useState();
  const { roles } = useRoles();
  const [formValues, setFormValues] = useState(values);
  const [formErrors, setFormErrors] = useState({});
  const toggleNotification = useNotification();

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const getError = (name) => {
    const value = formValues[name];
    const valueSettings = [
      ...FORM_VALUES,
      { name: "roles", required: true },
    ].find((v) => v.name === name);
    if (
      valueSettings.required &&
      !(Array.isArray(value) ? value.length : value?.trim().length)
    ) {
      const message = "Pole je povinné";
      setFormErrors((prev) => ({ ...prev, [name]: message }));
      return message;
    }

    return null;
  };

  const isInvalid = () => {
    const invalid =
      typeof [...FORM_VALUES, { name: "roles", required: true }]
        .map((entry) => getError(entry.name))
        .find((res) => res !== null) !== "undefined";
    return invalid;
  };

  const handleSubmit = async (e) => {
    // Prevent submitting parent form
    e.preventDefault();
    e.stopPropagation();
    if (!isInvalid()) {
      try {
        setStatus("loading");
        await (isUpdate
          ? settingsRequests.updateSetting(formValues.id, formValues)
          : settingsRequests.setSettings(formValues));
        setStatus("success");
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "notification.form.success.fields" }),
        });
        handleClose();
      } catch (err) {
        setStatus("error");
        toggleNotification({ type: "error", message: error.message });
      }
    }
  };

  console.log("formErrors", formErrors);

  return (
    <ModalLayout
      onClose={handleClose}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Přidat nastaveni
        </Typography>
      </ModalHeader>
      <ModalBody>
        {FORM_VALUES.map((entry, index) => (
          <Box key={`${entry.name}-${index}`} style={{ marginBottom: "1rem" }}>
            <TextInput
              placeholder={entry.placeholder}
              label={entry.label}
              name={entry.name}
              hint={entry.hint}
              value={formValues[entry.name]}
              onChange={handleValueChange}
              required={entry.required}
              error={formErrors[entry.name]}
            />
          </Box>
        ))}
        <Box>
          <Select
            id="select-roles"
            label="Role"
            placeholder="Vyberte role"
            onClear={() =>
              handleValueChange({ target: { name: "roles", value: [] } })
            }
            name="roles"
            error={formErrors["roles"]}
            value={formValues["roles"] ?? []}
            onChange={(val) =>
              handleValueChange({ target: { name: "roles", value: val } })
            }
            // customizeContent={(values) =>
            //   `${values.length} currently selected`
            // }
            required
            multi
            withTags
          >
            {roles?.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Box>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button type="button" onClick={handleClose} variant="tertiary">
            Zrušit
          </Button>
        }
        endActions={
          <Button type="submit" loading={status === "loading"}>
            {status === "loading" ? "Ukládám..." : "Uložit"}
          </Button>
        }
      />
    </ModalLayout>
  );
};
