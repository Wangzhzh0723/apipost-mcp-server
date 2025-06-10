export const Logger = {
  isHTTP: false,
  log: (...args) => {
    if (Logger.isHTTP) {
      console.log("[INFO]", ...args);
    } else {
      console.error("[INFO]", ...args);
    }
  },
  error: (...args) => {
    console.error("[ERROR]", ...args);
  },
};
