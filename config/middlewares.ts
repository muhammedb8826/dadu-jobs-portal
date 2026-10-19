export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://jobs-api.bluemoongt.com',
            'https://jobs.bluemoongt.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://jobs-api.bluemoongt.com',
            'https://jobs.bluemoongt.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        env('FRONTEND_URL', 'https://jobs.bluemoongt.com'),
        'https://jobs.bluemoongt.com',
        'http://localhost:3000',
      ],
      headers: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
