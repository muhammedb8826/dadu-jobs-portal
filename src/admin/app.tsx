import type { StrapiApp } from '@strapi/strapi/admin';
import { File } from '@strapi/icons';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to DADU Jobs Portal!",
        "Auth.form.welcome.subtitle": "Log in to your DADU Jobs Portal dashboard",
      },
    },
  },
  register(app: StrapiApp) {
    app.addMenuLink({
      to: '/reports/applications',
      icon: File,
      intlLabel: {
        id: 'app.reports.applications',
        defaultMessage: 'Applications Report',
      },
      Component: async () => import('./pages/ApplicationsReport'),
      permissions: [],
    });
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
