import logger from "./logger";

describe("logger", () => {
  describe("logger.error", () => {
    it("should be called", () => {
      logger.error("");
      expect(logger.error).toBeCalled();
    });
  });

  describe("logger.warn", () => {
    it("should be called", () => {
      logger.warn("");
      expect(logger.warn).toBeCalled();
    });
  });

  describe("logger.info", () => {
    it("should be called", () => {
      logger.info("");
      expect(logger.info).toBeCalled();
    });
  });

  describe("logger.debug", () => {
    it("should be called", () => {
      logger.debug("");
      expect(logger.debug).toBeCalled();
    });
  });
});