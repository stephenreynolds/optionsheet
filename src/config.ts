export default {
  isProduction: process.env.NODE_ENV === "production",
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT || 5000),
  jwt: {
    secret: process.env.SECRET,
    jwtExpiration: 3600, // 1 hour
    jwtRefreshExpiration: 86400 // 24 hours
  }
};