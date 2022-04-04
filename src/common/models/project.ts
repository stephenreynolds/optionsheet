export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  startingBalance?: number;
  risk?: number;
  createdOn: Date;
  updatedOn: Date;
  pinned?: boolean;
  stars?: number;
  username: string;
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