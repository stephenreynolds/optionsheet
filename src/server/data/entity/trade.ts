import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { OptionType, Side, TradeType } from "../tradeTypes";
import { Project } from "./project";

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("enum", { enum: TradeType })
  type: TradeType;

  @Column()
  symbol: string;

  @Column()
  open: Date;

  @Column({ nullable: true })
  closed?: Date;

  @OneToMany(() => Leg, (leg) => leg.trade, {
    eager: true,
    onDelete: "CASCADE"
  })
  legs: Leg[];

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "numeric", scale: 2 })
  priceFilled: number;

  @Column({ type: "numeric", scale: 2, nullable: true })
  priceClosed?: number;

  @Column({ nullable: true })
  openingNote?: string;

  @Column({ nullable: true })
  closingNote?: string;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => Project, (project) => project.trades)
  project: Project;
}

@Entity()
export class Leg {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("numeric", { scale: 2 })
  strike: number;

  @Column("enum", { enum: OptionType })
  type: OptionType;

  @Column("enum", { enum: Side })
  side: Side;

  @Column()
  expiration: Date;

  @ManyToOne(() => Trade, (trade) => trade.legs)
  trade: Trade;
}
