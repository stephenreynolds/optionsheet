export interface CreateProjectDto {
  project_url: string;
}

export interface GetProjectDto {
  name: string;
  username: string;
  description: string;
  created_on: Date;
  last_edited: Date;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
}