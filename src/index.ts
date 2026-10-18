export default {
  register({ strapi }: { strapi: any }) {
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
