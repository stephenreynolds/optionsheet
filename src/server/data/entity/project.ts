import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Trade } from "./trade";
import { User } from "./user";

@Entity()
export class Project {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => Trade, (trade) => trade.project, {
    onDelete: "CASCADE"
  })
  trades?: Trade[];

  @PrimaryColumn()
  @ManyToOne(() => User, (user) => user.id)
  user: number;

  @Column()
  description: string;

  @Column("text", { array: true })
  tags?: string[]
}
