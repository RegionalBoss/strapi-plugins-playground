export default ({ env }) => ({
  url: env("STRAPI_ACOUSTIC_NEWSLETTER_API", ""),
});
