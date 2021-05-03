import {
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
    method: "get",
    route: "/*",
    action: getApp
  }
];
