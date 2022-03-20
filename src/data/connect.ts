import { createConnection } from "typeorm";
import logger from "../logger";
import ormConfig from "./ormConfig";
import { seedData } from "./seed";

const connect = async () => {
  try {
    const connection = await createConnection(ormConfig);
    await seedData(connection);
    return connection;
  }
  catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default connect;