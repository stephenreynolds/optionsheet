import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trade } from "./trade";

export enum PutCall {
  Call = "Call",
  Put = "Put"
}

export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

@Entity()
export class Leg {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("enum", { enum: Side })
  side: Side;

  @Column("enum", { enum: PutCall, nullable: true })
  putCall?: PutCall;

  @Column({ type: "int" })
  quantity: number;

  @Column({ nullable: true })
  expiration?: Date;

  @Column("numeric", { scale: 2, nullable: true })
  strike?: number;

  @Column("numeric", { scale: 2 })
  openPrice: number;

  @Column("numeric", { scale: 2, nullable: true })
  closePrice?: number;

  @ManyToOne(() => Trade, (trade) => trade.legs, { onDelete: "CASCADE" })
  trade: Trade;
}