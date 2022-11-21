import pluginPkg from "../../package.json";

const pluginId = pluginPkg.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)((strapi-)?plugin)-/i,
  ""
);

export default pluginId;
