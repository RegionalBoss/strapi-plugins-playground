import React, { useState, useCallback } from "react";
import {
  Flex,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Box,
  Loader,
  FieldHint,
  FieldError,
  Select,
  Option,
  ToggleCheckbox,
  DatePicker,
  Field,
  FieldInput,
  FieldLabel,
} from "@strapi/design-system";
import { EditViewContext } from "../lib/contexts/EditViewContext";
import { ITEM_TYPE } from "../lib/constants";
import { useForm, Control, Controller } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "../hooks/useTranslation";

const HalfInline = styled.div`
  display: inline-block;
  width: 50%;
`;

const CheckboxLabel = styled(Typography)`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: fit-content;
`;

const RequiredStar = styled.span`
  color: #ee5e52;
  font-size: 0.875rem;
  line-height: 0;
`;

const FormTextInput = React.forwardRef((props, ref) => {
  const { label = "" } = props;

  return (
    <Field name={props.name} error={props.error} novalidate formnovalidate>
      <FieldLabel>
        {label}
        {props.required ? <RequiredStar>*</RequiredStar> : null}
      </FieldLabel>
      <FieldInput {...props} ref={ref} novalidate formnovalidate />
      <FieldHint />
      <FieldError />
    </Field>
  );
});

const FormSelect = React.forwardRef((props, ref) => {
  console.log("FormSelect", props);
  return (
    <div ref={ref}>
      <Select {...props} />
    </div>
  );
});
const FormDatePicker = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <DatePicker {...props} />
  </div>
));

export const EditMenuItemForm = ({ onClose }) => {
  const { itemToUpdate, pages } = React.useContext(EditViewContext);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    setError: setFormError,
    control,
  } = useForm({
    defaultValues: {
      ...itemToUpdate,
      visibleFrom: itemToUpdate.visibleFrom
        ? new Date(itemToUpdate.visibleFrom)
        : null,
      visibleTo: itemToUpdate.visibleTo
        ? new Date(itemToUpdate.visibleTo)
        : null,
    },
  });
  const { errors, isValid } = formState;

  console.log("pages", pages);

  const handleClose = (e) => {
    if (e.target.type === "button" && typeof onClose === "function") onClose();
  };

  const FORM_INPUTS = React.useMemo(
    () => [
      {
        name: "type",
        type: "select",
        rules: { required: true, disabled: true },
        input: FormSelect,
        label: "EditMenuItemForm.input.type.label",
        children: Object.keys(ITEM_TYPE)?.map((itemType) => (
          <Option key={itemType} value={itemType}>
            {t(`menuType.${itemType}`)}
          </Option>
        )),
        props: {
          required: true,
          disabled: true,
        },
      },
      {
        name: "name",
        type: "text",
        rules: { required: true, disabled: false },
        input: FormTextInput,
        label: "EditMenuItemForm.input.name.label",
        props: {
          required: true,
          disabled: false,
          placeholder: "Zadejte jméno",
        },
      },
      {
        condition: (itemToUpdate) =>
          [ITEM_TYPE.SYMBOLIC_LINK, ITEM_TYPE.HARD_LINK].includes(
            itemToUpdate.type
          ),
        name: "pageId",
        type: "select",
        rules: { required: true, disabled: false },
        input: FormSelect,
        label: "EditMenuItemForm.input.connectedPage.label",
        children: pages?.map((page) => (
          <Option key={page.id} value={page.id}>
            {page.title}
          </Option>
        )),
        props: {
          required: true,
          disabled: false,
        },
      },
      {
        condition: (itemToUpdate) => itemToUpdate.type === ITEM_TYPE.URL,
        type: "text",
        name: "absoluteLinkUrl",
        rules: { required: true, disabled: false },
        input: FormTextInput,
        label: "EditMenuItemForm.input.absoluteLinkUrl.label",
        props: {
          required: true,
          disabled: false,
        },
      },
      {
        name: "isVisible",
        type: "checkbox",
        label: "EditMenuItemForm.input.isVisible.label",
      },
      {
        name: "isProtected",
        type: "checkbox",
        label: "EditMenuItemForm.input.isProtected.label",
      },
      {
        name: "excludeFromHierarchy",
        type: "checkbox",
        label: "EditMenuItemForm.input.excludeFromHierarchy.label",
      },
      {
        name: "goToClosestChild",
        type: "checkbox",
        label: "EditMenuItemForm.input.goToClosestChild.label",
      },
      {
        name: "isHighlighted",
        type: "checkbox",
        label: "EditMenuItemForm.input.isHighlighted.label",
      },
      {
        type: "dom",
        name: "box_new_line",
        component: Box,
      },
      {
        name: "visibleFrom",
        type: "date",
        label: "EditMenuItemForm.input.visibleFrom.label",
      },
      {
        name: "visibleTo",
        type: "date",
        label: "EditMenuItemForm.input.visibleTo.label",
      },
    ],
    [pages]
  );

  const onSubmit = (formValue) => {
    console.log("form", formValue);
    typeof onClose === "function" && onClose(formValue);
  };

  const FormInput = React.useCallback(
    (formInput) => {
      if (formInput.type === "dom") {
        return <formInput.component {...formInput.props} />;
      }
      if (formInput.type === "checkbox") {
        return (
          <HalfInline style={{ marginBottom: "1rem" }}>
            <Controller
              name={formInput.name}
              control={control}
              render={({ field }) => (
                <CheckboxLabel as="label">
                  {t(formInput.label)}

                  <ToggleCheckbox
                    checked={field.value}
                    onLabel="Ano"
                    offLabel="Ne"
                    size="S"
                    {...formInput.props}
                    {...field}
                  >
                    {t(formInput.label)}
                  </ToggleCheckbox>
                </CheckboxLabel>
              )}
            />
          </HalfInline>
        );
      }
      if (formInput.type === "date") {
        return (
          <HalfInline style={{ marginBottom: "1rem", paddingRight: "1rem" }}>
            <Controller
              name={formInput.name}
              control={control}
              render={({ field }) => (
                <FormDatePicker
                  id={formInput.name}
                  name={formInput.name}
                  selectedDate={field.value}
                  label={t(formInput.label)}
                  locale="cs"
                  clearLabel={"Vymazat datum"}
                  onClear={() => setValue(formInput.name, null)}
                  onChange={(date) => setValue(formInput.name, date)}
                  selectedDateLabel={(formattedDate) =>
                    `Date picker, current is ${formattedDate}`
                  }
                />
              )}
            />
          </HalfInline>
        );
      }
      console.log(errors);
      return typeof formInput.condition === "undefined" ||
        (typeof formInput.condition === "function" &&
          formInput.condition(itemToUpdate)) ? (
        <Box style={{ marginBottom: "1rem" }} key={formInput.name}>
          <Controller
            name={formInput.name}
            control={control}
            rules={formInput.rules}
            render={({ field }) => (
              <formInput.input
                label={t(formInput.label)}
                {...formInput.props}
                error={
                  errors[formInput.name]?.type &&
                  errors[formInput.name]?.type === "required"
                    ? t("EditMenuItemForm.input.required")
                    : null
                }
                {...field}
              >
                {formInput.children}
              </formInput.input>
            )}
          />
        </Box>
      ) : null;
    },
    [errors]
  );

  return (
    <ModalLayout
      onClose={handleClose}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      noFormValidate
    >
      <ModalHeader closeLabel="Zrušit">
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {t("EditMenuItemForm.header")}
        </Typography>
      </ModalHeader>
      <ModalBody style={{ maxHeight: "80vh" }}>
        {FORM_INPUTS.map((formInput) => (
          <FormInput key={formInput.name} {...formInput} />
        ))}
      </ModalBody>
      <ModalFooter
        startActions={
          <Button type="button" onClick={() => onClose()} variant="tertiary">
            Zrušit
          </Button>
        }
        endActions={<Button type="submit">Uložit</Button>}
      />
    </ModalLayout>
  );
};
