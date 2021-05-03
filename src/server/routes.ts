import {
  getAllUsers,
  getUser,
  removeUser,
  saveUser
} from "./controllers/userController";
import { getApp } from "./controllers/clientController";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    action: getAllUsers
  },
  {
    method: "get",
    route: "/api/users/:id",
    action: getUser
  },
  {
    method: "post",
    route: "/api/users",
    action: saveUser
  },
  {
    method: "delete",
    route: "/api/users/:id",
    action: removeUser
  },
  {
    method: "get",
    route: "/*",
    action: getApp
  }
];
