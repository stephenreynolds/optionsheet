export interface ProjectCreateModel {
  name: string;
  description?: string;
  startingBalance?: number;
  tags?: string[];
}