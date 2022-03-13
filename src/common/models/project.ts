import { Tag } from "./tag";

export interface Project {
  name: string;
  description: string;
  tags?: Tag[];
  startingBalance?: number;
  risk?: number;
  lastEdited: Date;
}

export interface ProjectCreateModel {
  name: string;
  description: string;
  tags?: Tag[];
  startingBalance?: number;
}

export interface ProjectUpdateModel {
  name?: string;
  description?: string;
  tags?: Tag[];
  startingBalance?: number;
  risk?: number;
}

export interface ProjectSummaryModel {
  name: string;
  description: string;
  tags?: Tag[];
  lastEdited: Date;
}