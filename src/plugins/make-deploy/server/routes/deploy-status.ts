/**
 *  router
 */

import { factories } from "@strapi/strapi";
import pluginId from "../pluginId";

export default factories.createCoreRouter(`plugin::${pluginId}.deploy-status`);
