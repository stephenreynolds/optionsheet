export interface GetUserDto {
  username: string;
  url: string;
  html_url: string;
  projects_url: string;
  email: string;
  avatar_url: string;
  bio: string;
  created_on: Date;
  updated_on: Date;
  is_admin: boolean;
}

export interface StarredProjectDto {
  name: string;
  username: string;
  description: string;
  lastEdited: Date;
  tags?: string[];
}