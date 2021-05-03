import { UserController } from "./controllers/userController";
import { ClientController } from "./controllers/clientController";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "all"
  },
  {
    method: "get",
    route: "/api/users/:id",
    controller: UserController,
    action: "one"
  },
  {
    method: "post",
    route: "/api/users",
    controller: UserController,
    action: "save"
  },
  {
    method: "delete",
    route: "/api/users/:id",
    controller: UserController,
    action: "remove"
  },
  {
    method: "get",
    route: "/*",
    controller: ClientController,
    action: "app"
  }
];
