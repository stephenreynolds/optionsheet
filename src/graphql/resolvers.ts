import dateScalar from "./dateScalar";
import { users } from "../mockdb/users";

export const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(user => user.id === args.id)
  },
  Date: dateScalar
};