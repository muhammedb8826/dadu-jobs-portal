export default {
  routes: [
    {
      method: 'GET',
      path: '/applications/report/:jobId',
      handler: 'application.report',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/applications/report-excel/:jobId',
      handler: 'application.reportExcel',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

