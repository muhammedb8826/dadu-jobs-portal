export default {
  register() {},

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
