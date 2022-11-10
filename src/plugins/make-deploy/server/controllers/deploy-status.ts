/**
 *  controller
 */

import { factories } from "@strapi/strapi";
import pluginId from "../pluginId";

export default factories.createCoreController(
  `plugin::${pluginId}.deploy-status`
);
