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
  Select,
  Option,
  ToggleCheckbox,
  DatePicker,
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

const FormSelect = React.forwardRef((props, _ref) => <Select {...props} />);
const FormDatePicker = React.forwardRef((props, _ref) => (
  <DatePicker {...props} />
));

const FORM_INPUTS = [
  {
    name: "type",
    type: "select",
    rules: { required: true, disabled: true },
    input: FormSelect,
    label: "EditMenuItemForm.input.type.label",
    children: Object.keys(ITEM_TYPE)?.map((itemType) => ({
      component: Option,
      label: `menuType.${itemType}`,
      value: itemType,
    })),
    props: {
      required: true,
      disabled: true,
    },
  },
  {
    name: "name",
    type: "text",
    rules: { required: true, disabled: false },
    input: TextInput,
    label: "EditMenuItemForm.input.name.label",
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
    input: TextInput,
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
];

export const EditMenuItemForm = ({ onClose }) => {
  const { itemToUpdate } = React.useContext(EditViewContext);
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

  console.log("itemToUpdate", itemToUpdate);

  const onSubmit = (form) => {
    console.log("form", form);
    typeof onClose === "function" && onClose();
  };

  const FormInput = React.useCallback((formInput) => {
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
              {...field}
            >
              {Array.isArray(formInput.children) ||
              typeof formInput.children === "object"
                ? (Array.isArray(formInput.children)
                    ? formInput.children
                    : [formInput.children]
                  )?.map((child) => (
                    <child.component
                      key={child.value}
                      value={child.value}
                      {...child.props}
                    >
                      {t(child.label)}
                    </child.component>
                  ))
                : typeof formInput.children === "string"
                ? t(formInput.children)
                : null}
            </formInput.input>
          )}
        />
      </Box>
    ) : null;
  }, []);

  return (
    <ModalLayout
      onClose={onClose}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {t("EditMenuItemForm.header")}
        </Typography>
      </ModalHeader>
      <ModalBody style={{ maxHeight: "80vh" }}>
        {FORM_INPUTS.map((formInput) => (
          <FormInput key={formInput.name} {...formInput} />
        ))}
        <Typography as="p">
          Laborum labore occaecat aliquip non non deserunt aute sint et
          incididunt id et. Sit irure cupidatat sit quis commodo irure eu nulla
          sint. Commodo adipisicing anim nulla nostrud aliquip dolore laboris et
          non incididunt tempor dolor officia. Sunt est qui irure mollit Lorem
          enim. Nostrud aute labore dolore tempor proident ullamco ea enim ut
          eiusmod dolor minim elit irure. Labore labore laborum nulla ex
          eiusmod.
        </Typography>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button type="button" onClick={onClose} variant="tertiary">
            Zrušit
          </Button>
        }
        endActions={<Button type="submit">Uložit</Button>}
      />
    </ModalLayout>
  );
};
