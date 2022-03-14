import { Trade } from "../entities/trade";
import { Project } from "./project";

export class Tag {
  name: string;
  projects?: Project[];
  trades?: Trade[];
}