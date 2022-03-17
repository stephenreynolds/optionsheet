import app from "./app";
import config from "./config";
import connect from "./data/connect";
import { OrmDatabase } from "./data/ormDatabase";
import logger from "./logger";
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

app.listen(config.port, config.host, () => {
  logger.info(`Server listening at ${config.host}:${config.port}`);
});