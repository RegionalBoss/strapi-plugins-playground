/**
 *  service
 */

import { factories } from "@strapi/strapi";
import pluginId from "../pluginId";

export default factories.createCoreService(`plugin::${pluginId}.deploy-status`);
