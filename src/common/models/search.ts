import { User } from "./user";
import { Project } from "./project";
import { Trade } from "./trade";

export interface SearchModel {
  items: Trade[] | Project[] | User[];
  counts: {
    trades: number;
    projects: number;
    users: number;
  };
}