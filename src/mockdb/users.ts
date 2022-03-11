import { User } from "../models/user";

export const users: User[] = [
  {
    id: "0",
    username: "Bob",
    email: "test@gmail.com",
    emailConfirmed: false
  },
  {
    id: "1",
    username: "Steve",
    email: "steve@outlook.com",
    emailConfirmed: false
  },
  {
    id: "2",
    username: "John",
    email: "john@mail.io",
    emailConfirmed: true
  }
];