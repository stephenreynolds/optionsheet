export interface Project {
  name: string;
  description: string;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
  updated_on: Date;
}

export interface ProjectCreateModel {
  name: string;
  description: string;
  tags?: string[];
  starting_balance?: number;
}

export interface ProjectUpdateModel {
  name?: string;
  description?: string;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
}

export interface ProjectSummaryModel {
  name: string;
  description: string;
  tags?: string[];
  updated_on: Date;
}