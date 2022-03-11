import config from "./config";
import app from "./app";

app.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});