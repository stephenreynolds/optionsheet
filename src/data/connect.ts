import { createConnection } from "typeorm";
import ormConfig from "./ormConfig";
import { seedData } from "./seed";

const connect = async () => {
  const connection = await createConnection(ormConfig);
  await seedData(connection);
  return connection;
};

export default connect;