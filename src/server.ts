import http from "http";
import https from "https";
import app from "./app";
import config from "./config";
import connect from "./data/connect";
import { OrmDatabase } from "./data/ormDatabase";
import Request from "./request";
import routes from "./routes";

// Connect to the database and inject a wrapper into every request.
connect().then((connection) => {
  const database = new OrmDatabase(connection);

  app.use(async (req: Request, res, next) => {
    req.dataService = database;
    next();
  }, routes);
});

// USE HTTP if enabled.
if (config.http.enabled) {
  const server = http.createServer(app);

  server.listen(config.http.port, config.host, () => {
    console.log(`Server listening at http://${config.host}:${config.http.port}`);
  });
}

// Use HTTPS if enabled.
if (config.https.enabled) {
  const server = https.createServer(config.https, app);

  server.listen(config.https.port, config.host, () => {
    console.log(`Server listening at https://${config.host}:${config.https.port}`);
  });
}