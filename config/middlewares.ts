export default [
  "strapi::errors",
  // 'strapi::security',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "media-library.cloudinary.com",
          ],
          "frame-src": ["'self'", "'unsafe-inline'", "cloudinary.com"],
          "img-src": [
            "'self'",
            "data:",
            "res.cloudinary.com",
            "strapi.io",
            `res.cloudinary.com`,
          ],
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
