const USER_OWNED_UIDS = [
  "api::job.job",
  "api::candidate-profile.candidate-profile",
  "api::employer-profile.employer-profile",
] as const;

export default {
  register({ strapi }: { strapi: any }) {
    // Link user-owned content via Document Service (REST strips `user` for Authenticated).
    // Only users-permissions users — never Strapi Admin users (different documentIds).
    strapi.documents.use(async (context: any, next: () => Promise<unknown>) => {
      if (
        USER_OWNED_UIDS.includes(context.uid) &&
        (context.action === "create" || context.action === "update") &&
        context.params?.data
      ) {
        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user as
          | {
              id?: number | string;
              documentId?: string;
              roles?: unknown[];
              role?: unknown;
              provider?: string;
              confirmed?: boolean;
            }
          | undefined;

        const strategy = ctx?.state?.auth?.strategy?.name as string | undefined;
        const isAdminUser =
          !user ||
          strategy === "admin" ||
          Array.isArray(user.roles); // admin::user has roles[]; UP user has role

        const isContentUser =
          !isAdminUser &&
          (strategy === "users-permissions" ||
            user.role != null ||
            typeof user.confirmed === "boolean" ||
            typeof user.provider === "string");

        if (isContentUser && (user.documentId || user.id != null)) {
          context.params.data.user = user.documentId || user.id;
        }
      }
      return next();
    });

    // Windows often locks temp files during/after multipart upload cleanup.
    // An uncaught EBUSY unlink would otherwise kill the Strapi process.
    process.on("uncaughtException", (err: NodeJS.ErrnoException) => {
      if (err?.code === "EBUSY" && err?.syscall === "unlink") {
        strapi.log.warn(
          `Ignoring Windows EBUSY unlink (${err.path || "temp file"})`
        );
        return;
      }
      strapi.log.error(err);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: unknown) => {
      const err = reason as NodeJS.ErrnoException | undefined;
      if (err?.code === "EBUSY" && err?.syscall === "unlink") {
        strapi.log.warn(
          `Ignoring Windows EBUSY unlink rejection (${err.path || "temp file"})`
        );
        return;
      }
      strapi.log.error(reason);
    });
  },

  /**
   * Media Library settings live in the plugin store (not plugins.ts).
   * Disable sharp optimization so Windows does not fail uploads with
   * EBUSY when unlinking temp "optimized-*" files.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const uploadService = strapi.plugin("upload").service("upload");
      const current = (await uploadService.getSettings()) || {};
      if (
        current.sizeOptimization === false &&
        current.responsiveDimensions === false &&
        current.autoOrientation === false
      ) {
        return;
      }

      await uploadService.setSettings({
        ...current,
        sizeOptimization: false,
        responsiveDimensions: false,
        autoOrientation: false,
      });
      strapi.log.info(
        "Upload settings: sizeOptimization/responsiveDimensions/autoOrientation disabled (Windows EBUSY workaround)"
      );
    } catch (error) {
      strapi.log.warn("Could not update upload settings:", error);
    }
  },
};
