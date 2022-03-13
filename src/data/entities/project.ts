import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trade } from "./trade";
import { User } from "./user";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  user: number;

  @OneToMany(() => Trade, (trade) => trade.project, {
    cascade: true,
    onDelete: "CASCADE"
  })
  trades?: Trade[];

  @Column()
  description: string;

  @Column("text", { array: true })
  tags?: string[];

  @Column("numeric", { scale: 2, nullable: true })
  startingBalance?: number;

  @Column("numeric", { scale: 2, nullable: true })
  risk?: number;

  @Column({ default: new Date() })
  lastEdited: Date;
}