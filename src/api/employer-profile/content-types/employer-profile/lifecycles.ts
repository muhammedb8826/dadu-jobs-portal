/**
 * Always link employer profiles to the authenticated user.
 * REST Authenticated role cannot write `user` ("Invalid key user"),
 * so this runs after sanitization — same pattern as candidate-profile.
 */
function linkAuthenticatedUser(data?: Record<string, unknown>) {
  if (!data) return;

  const ctx = strapi.requestContext.get();
  const user = ctx?.state?.user as
    | {
        id?: number | string;
        documentId?: string;
        roles?: unknown[];
        role?: unknown;
        confirmed?: boolean;
        provider?: string;
      }
    | undefined;

  if (!user?.id) return;
  if (Array.isArray(user.roles) || ctx?.state?.auth?.strategy?.name === "admin") {
    return;
  }
  if (
    user.role == null &&
    typeof user.confirmed !== "boolean" &&
    typeof user.provider !== "string"
  ) {
    return;
  }

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
