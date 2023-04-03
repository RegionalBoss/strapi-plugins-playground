import {
  faCopy,
  faTimes,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  DatePicker,
  Divider,
  Field,
  FieldError,
  FieldHint,
  FieldInput,
  FieldLabel,
  IconButton,
  ModalBody,
  ModalFooter,
  Option,
  Select,
  ToggleCheckbox,
  Typography,
} from "@strapi/design-system";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { useTranslation } from "../hooks/useTranslation";
import { ITEM_TYPE } from "../lib/constants";
import { EditViewContext } from "../lib/contexts/EditViewContext";
import { useConfirmDialog } from "../lib/contexts/ConfirmDialogContext";

const HalfInline = styled.div`
  display: inline-block;
  width: 100%;
`;

const CheckboxLabel = styled(Typography)`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: inherit;
`;

const RequiredStar = styled.span`
  color: #ee5e52;
  font-size: 0.875rem;
  line-height: 0;
`;

const Form = styled.form`
  max-width: 40vw;
  @media (max-width: 768px) {
    max-width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: ${({ theme }) => theme.colors.neutral0};
    z-index: 100;
    height: 100vh;
    width: 100vw;
  }
`;

const FormHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  h2 {
    font-size: 1.5rem;
  }
`;

const FormTextInput = React.forwardRef((props, ref) => {
  const { label = "" } = props;

  return (
    <Field name={props.name} error={props.error}>
      <FieldLabel>
        {label}
        {props.required ? <RequiredStar>*</RequiredStar> : null}
      </FieldLabel>
      <FieldInput {...props} ref={ref} />
      <FieldHint />
      <FieldError />
    </Field>
  );
});

const FormSelect = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <Select {...props} />
  </div>
));
const FormDatePicker = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <DatePicker {...props} />
  </div>
));

export const EditMenuItemForm = () => {
  const {
    items,
    pages,
    handleFormModalClose,
    isEditMode,
    saveDataAndPickById,
    duplicateItem,
    deleteItem,
    selectedItemId,
    updateItem,
  } = React.useContext(EditViewContext);

  const itemToUpdate = items.find((item) => item.id === selectedItemId);

  const { t } = useTranslation();
  const { showConfirmDialog } = useConfirmDialog();

  // const { handleSubmit, formState, setValue, control, reset } = useForm({
  //   defaultValues: {
  //     ...itemToUpdate,
  //     visibleFrom: itemToUpdate.visibleFrom
  //       ? new Date(itemToUpdate.visibleFrom)
  //       : null,
  //     visibleTo: itemToUpdate.visibleTo
  //       ? new Date(itemToUpdate.visibleTo)
  //       : null,
  //   },
  // });
  // const { errors } = formState;

  const havePage = itemToUpdate.type === ITEM_TYPE.PAGE;

  const page = havePage
    ? pages.find((page) => page.id === itemToUpdate.pageId)
    : null;

  const handleClose = (e) => {
    if (
      (!e || e.target.type === "button") &&
      typeof handleFormModalClose === "function"
    )
      handleFormModalClose();
  };

  const handleDuplicateItem = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let itemIdToDuplicate = itemToUpdate.id;

    // special FE-x-BE case where we have to sync data with database
    if (havePage && page._feGenerated) {
      const saveDataAndDuplicate = await showConfirmDialog(
        t(
          "PageHierarchyEditor.update.duplicatePageItem.button.haveToSave.confirm.title"
        ),
        t(
          "PageHierarchyEditor.update.duplicatePageItem.button.haveToSave.confirm.message"
        )
      );
      if (!saveDataAndDuplicate) return;
      itemIdToDuplicate = await saveDataAndPickById(item.id);
    }

    duplicateItem(itemIdToDuplicate);
  };

  const handleRemove = async () => {
    if (
      await showConfirmDialog(
        t("EditMenuItemForm.delete.warning.confirm.title"),
        t("EditMenuItemForm.delete.warning.confirm.message")
      )
    )
      deleteItem(itemToUpdate.id);
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
          disabled: !isEditMode,
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
          disabled: !isEditMode,
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
          disabled: !isEditMode,
        },
      },
      {
        name: "isVisible",
        type: "checkbox",
        label: "EditMenuItemForm.input.isVisible.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "isProtected",
        type: "checkbox",
        label: "EditMenuItemForm.input.isProtected.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "excludeFromHierarchy",
        type: "checkbox",
        label: "EditMenuItemForm.input.excludeFromHierarchy.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "goToClosestChild",
        type: "checkbox",
        label: "EditMenuItemForm.input.goToClosestChild.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "isHighlighted",
        type: "checkbox",
        label: "EditMenuItemForm.input.isHighlighted.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "visibleFrom",
        type: "date",
        label: "EditMenuItemForm.input.visibleFrom.label",
        props: {
          disabled: !isEditMode,
        },
      },
      {
        name: "visibleTo",
        type: "date",
        label: "EditMenuItemForm.input.visibleTo.label",
        props: {
          disabled: !isEditMode,
        },
      },
    ],
    [pages, isEditMode]
  );

  return (
    <Form onSubmit={() => null} noValidate noFormValidate>
      <FormHeader>
        <IconButton
          icon={<FontAwesomeIcon icon={faTimes} />}
          label="Zavrit"
          onClick={handleClose}
        ></IconButton>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {t("EditMenuItemForm.header")}
        </Typography>
      </FormHeader>
      <Divider />
      <ModalBody style={{ maxHeight: "80vh" }}>
        {FORM_INPUTS.map((formInput) => {
          if (formInput.type === "checkbox") {
            return (
              <HalfInline style={{ marginBottom: "1rem" }}>
                <CheckboxLabel as="label">
                  {t(formInput.label)}
                  <ToggleCheckbox
                    checked={itemToUpdate[formInput.name] ?? false}
                    onLabel="Ano"
                    offLabel="Ne"
                    size="S"
                    onChange={(event) => {
                      itemToUpdate &&
                        updateItem(itemToUpdate?.id, {
                          [formInput.name]: event.target.checked,
                        });
                    }}
                    {...formInput.props}
                  >
                    {t(formInput.label)}
                  </ToggleCheckbox>
                </CheckboxLabel>
              </HalfInline>
            );
          }
          if (formInput.type === "date") {
            return (
              <HalfInline
                style={{ marginBottom: "1rem", paddingRight: "1rem" }}
              >
                <FormDatePicker
                  id={formInput.name}
                  name={formInput.name}
                  selectedDate={itemToUpdate[formInput.name]}
                  label={t(formInput.label)}
                  locale="cs"
                  clearLabel={"Vymazat datum"}
                  onClear={() => {
                    itemToUpdate &&
                      updateItem(itemToUpdate?.id, { [formInput.name]: null });
                  }}
                  onChange={(date) => {
                    itemToUpdate &&
                      updateItem(itemToUpdate?.id, { [formInput.name]: date });
                  }}
                  disabled={!isEditMode}
                  selectedDateLabel={(formattedDate) =>
                    `Date picker, current is ${formattedDate}`
                  }
                />
              </HalfInline>
            );
          }
          return typeof formInput.condition === "undefined" ||
            (typeof formInput.condition === "function" &&
              formInput.condition(itemToUpdate)) ? (
            <Box style={{ marginBottom: "1rem" }} key={formInput.name}>
              <formInput.input
                label={t(formInput.label)}
                {...formInput.props}
                value={itemToUpdate[formInput.name]}
                onChange={(event) => {
                  itemToUpdate &&
                    updateItem(itemToUpdate?.id, {
                      [formInput.name]: event.target.value,
                    });
                }}
              >
                {formInput.children}
              </formInput.input>
            </Box>
          ) : null;
        })}
      </ModalBody>
      {isEditMode && (
        <ModalFooter
          startActions={
            <Button
              disabled={havePage && !page}
              onClick={handleDuplicateItem}
              style={{ marginRight: "0.5rem" }}
              startIcon={<FontAwesomeIcon icon={faCopy} />}
            >
              {t(
                havePage
                  ? page
                    ? "PageHierarchyEditor.update.duplicatePageItem.button"
                    : "PageHierarchyEditor.update.duplicate.pendingSave.warning.button"
                  : "PageHierarchyEditor.update.duplicateNonPageItem.button"
              )}
            </Button>
          }
          endActions={
            !itemToUpdate.isProtected && (
              <Button
                onClick={handleRemove}
                variant="secondary"
                startIcon={<FontAwesomeIcon icon={faTrash} />}
              >
                {havePage
                  ? t("EditMenuItemForm.delete.itemAndPage")
                  : t("EditMenuItemForm.delete.item")}
              </Button>
            )
          }
        ></ModalFooter>
      )}
    </Form>
  );
};
