/**
 * Always link employer profiles to the authenticated user.
 * REST Authenticated role cannot write `user` ("Invalid key user"),
 * so this runs after sanitization — same pattern as candidate-profile.
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
