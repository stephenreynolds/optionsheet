import { ConnectionOptions } from "typeorm";
import { Leg } from "./entities/leg";
import { Project } from "./entities/project";
import { Role } from "./entities/role";
import { Trade } from "./entities/trade";
import { User } from "./entities/user";
import { Tag } from "./entities/tag";

const ormConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || "optionsheet",
  username: process.env.DB_USERNAME || "optionsheet",
  password: process.env.DB_PASSWORD || "optionsheet",
  synchronize: true,
  logging: false,
  entities: [User, Role, Trade, Leg, Project, Tag],
  migrations: [`${__dirname}/migrations/**/*.ts`],
  subscribers: [`${__dirname}/subscribers/**/*.ts`],
  cli: {
    entitiesDir: `${__dirname}/entities`,
    migrationsDir: `${__dirname}/migrations`,
    subscribersDir: `${__dirname}/subscribers`
  }
};

export default ormConfig;