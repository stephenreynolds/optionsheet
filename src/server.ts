import config from "./config";
import http from "http";
import https from "https";
import connect from "./data/connect";
import dataService from "./data/dataService";
import routes from "./routes";
import app from "./app";

connect().then();

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