import { Trade } from "./trade";

export interface Project {
  name: string;
  description: string;
  tags?: string[]
  trades?: Trade[];
}
