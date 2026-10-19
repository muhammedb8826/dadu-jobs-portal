export default ({ env }) => ({
  // Disable sharp optimization on Windows — temp file unlink often hits EBUSY
  // ("resource busy or locked") and returns 500 from POST /api/upload.
  upload: {
    config: {
      sizeOptimization: false,
      responsiveDimensions: false,
    },
  },

  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 465),
        secure: true,
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM_EMAIL'),
        defaultReplyTo: env('SMTP_REPLY_TO_EMAIL'),
      },
    },
  },

  'users-permissions': {
    config: {
      register: {
        allowedFields: ['type', 'firstName', 'lastName'],
      },
      emailConfirmation: {
        enabled: true,
        redirectUrl: `${env('FRONTEND_URL', 'https://jobs.bluemoongt.com')}/email-confirmation`,
      },
    },
  },
});