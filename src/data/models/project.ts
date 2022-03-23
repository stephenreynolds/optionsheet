export interface ProjectCreateModel {
  name: string;
  description?: string;
  startingBalance?: number;
  tags?: string[];
}

export interface ProjectUpdateModel {
  name?: string;
  description?: string;
  startingBalance?: number;
  risk?: number;
  tags?: string[];
}