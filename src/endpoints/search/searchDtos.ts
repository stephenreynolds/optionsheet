import { Project } from "../../data/entities/project";
import { Trade } from "../../data/entities/trade";
import { User } from "../../data/entities/user";

export interface SearchDto {
  items: Trade[] | Project[] | User[];
  counts: {
    trades: number;
    projects: number;
    users: number;
  }
}