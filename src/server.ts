import express from "express";
import config from "./config";

const app = express();

app.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});