/**
 * Always link jobs to the authenticated employer.
 * REST Authenticated role cannot write `user` ("Invalid key user").
 */
function linkAuthenticatedUser(data?: Record<string, unknown>) {
  if (!data) return;

  const ctx = strapi.requestContext.get();
  const user = ctx?.state?.user as
    | { id?: number | string; documentId?: string }
    | undefined;

  if (!user?.id) return;

  data.user = user.id;
}

export default {
  async beforeCreate(event: { params: { data?: Record<string, unknown> } }) {
    linkAuthenticatedUser(event.params.data);
  },

  async beforeUpdate(event: { params: { data?: Record<string, unknown> } }) {
    linkAuthenticatedUser(event.params.data);
  },
};
