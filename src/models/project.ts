import { ID } from "./types";

export interface Project {
  id: ID;
  name: string;
  description: string;
  tags: string[];
  lastEdited: Date;
  userId: ID;
}