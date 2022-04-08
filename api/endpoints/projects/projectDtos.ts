export interface CreateProjectDto {
  project_url: string;
}

export interface GetProjectDto {
  id: number;
  name: string;
  username: string;
  description: string;
  created_on: Date;
  updated_on: Date;
  pinned?: boolean;
  tags?: string[];
  starting_balance?: number;
  risk?: number;
  stars?: number;
}