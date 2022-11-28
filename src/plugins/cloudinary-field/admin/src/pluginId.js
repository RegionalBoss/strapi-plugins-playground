import pluginPkg from "../../package.json";

export const pluginId = pluginPkg.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)((strapi-)?plugin)-/i,
  ""
);

export default pluginId;
