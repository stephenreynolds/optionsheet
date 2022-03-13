import { Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Project } from "./project";
import { Trade } from "./trade";

@Entity()
export class Tag {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Project, (project) => project.tags)
  projects?: Project[];

  @ManyToMany(() => Trade, (trade) => trade.tags)
  trades?: Trade[];
}