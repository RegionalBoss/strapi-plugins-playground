import { camelCase } from "lodash";

export const convertKeysFromSnakeCaseToCamelCase = (
  obj: Record<string, unknown>
) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [camelCase(key), value])
  );
