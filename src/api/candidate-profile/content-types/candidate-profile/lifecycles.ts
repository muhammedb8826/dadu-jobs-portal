/**
 * Always link candidate profiles to the authenticated user.
 * Runs after REST input sanitization, so the relation is set even when
 * the Content API strips `user` from the request body ("Invalid key user").
 *
 * Use numeric id — same as employer-profiles — so the DB FK is valid.
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

  // Prefer numeric id for the join column (Strapi/users-permissions)
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
