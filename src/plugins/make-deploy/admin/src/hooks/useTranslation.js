import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import getTrad from "../utils/getTrad";

export const useTranslation = () => {
  const { formatMessage } = useIntl();
  const t = useCallback(
    (key, def) =>
      formatMessage({
        id: getTrad(key),
        defaultMessage: def,
      }),
    []
  );
  return { t };
};
