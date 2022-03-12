import { ID } from "./types";

export interface Trade {
  id: ID;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  tags: string[];
  projectId: ID;
}