export interface Project {
  id: number;
  name: string;
  description: string;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
  created_on: Date;
  updated_on: Date;
  pinned?: boolean;
  stars?: number;
}

export interface ProjectCreateModel {
  name: string;
  description: string;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
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