export default {
  port: Number(process.env.PORT || 4001),
  host: process.env.HOST || "localhost",
  isProduction: process.env.NODE_ENV === "production"
};