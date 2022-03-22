import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project";
import { Leg } from "./leg";
import { Tag } from "./tag";

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

  @ManyToMany(() => Tag, (tag) => tag.trades, {
    eager: true,
    cascade: true
  })
  @JoinTable()
  tags?: Tag[];

  @ManyToOne(() => Project, (project) => project.trades, { onDelete: "CASCADE" })
  project: Project;

  @Column()
  projectId?: number;
}