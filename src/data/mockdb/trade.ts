import { Leg } from "./leg";
import { Project } from "./project";
import { Tag } from "./tag";

export class Trade {
  id?: number;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  legs: Leg[];
  openingNote?: string;
  closingNote?: string;
  tags?: Tag[];
  project: Project;
}