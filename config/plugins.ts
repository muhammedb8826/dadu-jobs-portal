export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME || 'muhammedb8826@gmail.com',
          pass: process.env.SMTP_PASSWORD || 'mlzo pduh igpc bkif',
        },
      },
      settings: {
        defaultFrom: process.env.SMTP_FROM_EMAIL || 'muhammedb8826@gmail.com',
        defaultReplyTo: process.env.SMTP_REPLY_TO_EMAIL || 'muhammedb8826@gmail.com',
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
        redirectUrl: `${env('FRONTEND_URL', 'https://jobs.qenenia.com')}/email-confirmation`,
      },
    },
  },
});