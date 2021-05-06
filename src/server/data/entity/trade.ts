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

  @Column()
  closed?: Date;

  @OneToMany(() => Leg, (leg) => leg.trade, {
    eager: true,
    onDelete: "CASCADE"
  })
  legs: Leg[];

  @Column({ type: "int" })
  quantity: number;

  @Column()
  @Column({ type: "numeric", scale: 2 })
  priceFilled: number;

  @Column()
  @Column({ type: "numeric", scale: 2 })
  priceClosed?: number;

  @Column()
  openingNote?: string;

  @Column()
  closingNote?: string;

  @Column("text", { array: true })
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
