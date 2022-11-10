import pluginPkg from "../package.json";

const pluginId = pluginPkg.name.replace(
  /^(@[^-,.][\w,-]+\/|strapi-)((strapi-)?plugin)-/i,
  ""
);

console.log("PLUGIN ID: ", pluginId);

export default pluginId;
