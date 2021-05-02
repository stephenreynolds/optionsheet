const env = process.env;

export default {
  port: Number(env.PORT || 4001),
  host: env.HOST || "localhost",
  isDevelopment: env.NODE_ENV !== "production",
};
