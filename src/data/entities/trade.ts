import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project";
import { Leg } from "./leg";

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  symbol: string;

  @Column()
  openDate: Date;

  @Column({ nullable: true })
  closeDate?: Date;

  @OneToMany(() => Leg, (leg) => leg.trade, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  legs: Leg[];

  @Column({ nullable: true })
  openingNote?: string;

  @Column({ nullable: true })
  closingNote?: string;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => Project, (project) => project.trades, { onDelete: "CASCADE" })
  project: Project;
}