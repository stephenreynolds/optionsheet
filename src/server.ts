import app from "./app";
import config from "./config";
import { Database } from "./data/database";
import logger from "./logger";
import Request from "./request";
import routes from "./routes";

// Connect to the database and inject a wrapper into every request.
const database = new Database();

app.use(async (req: Request, res, next) => {
  req.dataService = database;
  next();
}, routes);

app.listen(config.port, config.host, () => {
  logger.info(`Server listening at ${config.host}:${config.port}`);
});