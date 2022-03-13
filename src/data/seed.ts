import { Connection } from "typeorm";
import { Role } from "./entities/role";

export const seedData = async (connection: Connection) => {
  const user: Role = { name: "user" };
  const admin: Role = { name: "admin" };

  await connection
    .createQueryBuilder()
    .insert()
    .into(Role)
    .values([user, admin])
    .orIgnore()
    .execute();
};
