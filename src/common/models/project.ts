export interface Project {
  name: string;
  description: string;
  tags?: string[];
  startingBalance?: number;
  risk?: number;
  lastEdited: Date;
}

export interface ProjectCreateModel {
  name: string;
  description: string;
  tags?: string[];
  startingBalance?: number;
}

export interface ProjectUpdateModel {
  name?: string;
  description?: string;
  tags?: string[];
  startingBalance?: number;
  risk?: number;
}

export interface ProjectSummaryModel {
  name: string;
  description: string;
  tags?: string[];
  lastEdited: Date;
}