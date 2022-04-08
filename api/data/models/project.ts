export interface ProjectCreateModel {
  name: string;
  description?: string;
  starting_balance?: number;
  risk?: number;
  tags?: string[];
}

export interface ProjectUpdateModel {
  name?: string;
  description?: string;
  starting_balance?: number;
  risk?: number;
  tags?: string[];
}