import { useCallback } from "react";
import { useIntl } from "react-intl";
import getTrad from "../utils/getTrad";

export const useTranslation = () => {
  const { formatMessage } = useIntl();
  const t = useCallback(
    (key: string, defaultMessage?: string) =>
      formatMessage({
        id: getTrad(key),
        defaultMessage: defaultMessage,
      }),
    []
  );
  return { t, formatMessage };
};
