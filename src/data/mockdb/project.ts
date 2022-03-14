import { Trade } from "./trade";
import { Tag } from "./tag";

export class Project {
  id: number;
  name: string;
  user: number;
  trades?: Trade[];
  description: string;
  tags?: Tag[];
  startingBalance?: number;
  risk?: number;
  lastEdited: Date = new Date();
}