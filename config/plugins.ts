// path: ./config/plugins.ts

export default {
  slugify: {
    enabled: true,
    resolve: "./src/plugins/slugify",
  },
  todo: {
    enabled: true,
    resolve: "./src/plugins/todo",
  },
  "make-deploy": {
    enabled: true,
    resolve: "./src/plugins/make-deploy",
  },
};
