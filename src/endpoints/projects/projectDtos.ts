export interface CreateProjectDto {
  projectUrl: string;
}

export interface GetProjectDto {
  name: string;
  username: string;
  description: string;
  createdOn: Date;
  lastEdited: Date;
  tags?: string[];
  startingBalance?: number;
  risk?: number;
}