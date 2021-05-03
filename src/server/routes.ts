import {
  checkEmail,
  checkUsername,
  createUser
} from "./controllers/userController";
import { getApp } from "./controllers/clientController";

export const Routes = [
  {
    method: "post",
    route: "/api/users",
    action: createUser
  },
  {
    method: "post",
    route: "/api/users/check_email",
    action: checkEmail
  },
  {
    method: "post",
    route: "/api/users/check_username",
    action: checkUsername
  },
  {
    method: "get",
    route: "/*",
    action: getApp
  }
];
