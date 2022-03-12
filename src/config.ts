import fs from "fs";

export default {
  isProduction: process.env.NODE_ENV === "production",
  secret: process.env.SECRET,
  host: process.env.HOST || "localhost",
  http: {
    enabled: process.env.HTTP === "enabled",
    port: Number(process.env.HTTP_PORT || 80)
  },
  https: {
    enabled: process.env.HTTPS === "enabled",
    port: Number(process.env.HTTPS_PORT || 443),
    key: process.env.HTTPS_KEY ? fs.readFileSync(process.env.HTTPS_KEY) : "",
    cert: process.env.HTTPS_CERT ? fs.readFileSync(process.env.HTTPS_CERT) : ""
  }
};