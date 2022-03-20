import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StarredProject {
  @PrimaryColumn()
  projectId: number;

  @PrimaryColumn()
  userId: number;
}