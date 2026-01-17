export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3001),
  url: env('PUBLIC_URL', 'https://jobs-portal.qenenia.com'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
