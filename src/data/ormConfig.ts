import { ConnectionOptions } from "typeorm";

const ormConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || "optionsheet",
  username: process.env.DB_USERNAME || "optionsheet",
  password: process.env.DB_PASSWORD || "optionsheet",
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [`${__dirname}/migrations/**/*.ts`],
  subscribers: [`${__dirname}/subscribers/**/*.ts`],
  cli: {
    entitiesDir: `${__dirname}/entities`,
    migrationsDir: `${__dirname}/migrations`,
    subscribersDir: `${__dirname}/subscribers`
  }
};

export default ormConfig;