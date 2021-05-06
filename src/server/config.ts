import { User } from "./data/entity/user";
import { ConnectionOptions } from "typeorm";
import { Role } from "./data/entity/role";
import { Leg, Trade } from "./data/entity/trade";
import { Project } from "./data/entity/project";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [User, Role, Trade, Leg, Project],
  migrations: [],
  subscribers: []
};

export default {
  port: Number(process.env.PORT || 4001),
  devPort: Number(process.env.DEV_PORT || 4000),
  host: process.env.HOST || "localhost",
  isProduction: process.env.NODE_ENV === "production",
  secret: process.env.SECRET,
  connectionOptions
};
