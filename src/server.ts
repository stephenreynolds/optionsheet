import config from "./config";
import { Express } from "express";
import http from "http";
import https from "https";
import dataService from "./data/dataService";
import routes from "./routes";

const startServer = (app: Express) => {
  app.use(dataService, routes);

  if (config.http.enabled) {
    const server = http.createServer(app);

    server.listen(config.http.port, config.host, () => {
      console.log(`Server listening at http://${config.host}:${config.http.port}`);
    });
  }

  if (config.https.enabled) {
    const server = https.createServer(config.https, app);

    server.listen(config.https.port, config.host, () => {
      console.log(`Server listening at https://${config.host}:${config.https.port}`);
    });
  }
};

export default startServer;