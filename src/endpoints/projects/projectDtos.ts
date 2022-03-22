export interface GetProjectDto {
  name: string;
  username: string;
  description: string;
  lastEdited: Date;
  tags?: string[];
}

export interface GetProjectByNameDto {
  name: string;
  description: string;
  lastEdited: Date;
  tags?: string[];
  startingBalance?: number;
  risk?: number;
}

export interface CreateProjectDto {
  projectUrl: string;
}