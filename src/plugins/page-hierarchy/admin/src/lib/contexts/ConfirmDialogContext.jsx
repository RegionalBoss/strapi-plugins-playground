import React, { useState, useRef } from "react";
import { useTranslation } from "../../hooks/useTranslation";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Stack,
  Typography,
} from "@strapi/design-system";

import Check from "@strapi/icons/Check";
import ExclamationMarkCircle from "@strapi/icons/ExclamationMarkCircle";

export const ConfirmDialogContext = React.createContext({});

export const ConfirmDialogProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const _promiseThenConfirmModal = useRef();

  const showConfirmDialog = (title, message) => {
    const result = new Promise((resolve) => {
      _promiseThenConfirmModal.current = resolve;
    });
    setIsVisible(true);
    setTitle(title);
    setMessage(message);
    return result;
  };

  const setConfirm = (isConfirmed) => {
    setIsVisible(false);
    setTitle("");
    setMessage("");
    _promiseThenConfirmModal.current(isConfirmed);
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirmDialog }}>
      {children}
      <Dialog
        onClose={() => setConfirm(false)}
        title={title}
        isOpen={isVisible}
      >
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Stack spacing={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description">{message}</Typography>
            </Flex>
          </Stack>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={() => setConfirm(false)} variant="tertiary">
              {t("cancel")}
            </Button>
          }
          endAction={
            <Button
              variant="default"
              startIcon={<Check />}
              onClick={() => setConfirm(true)}
            >
              {t("confirm")}
            </Button>
          }
        />
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const { showConfirmDialog } = React.useContext(ConfirmDialogContext);
  return { showConfirmDialog };
};
