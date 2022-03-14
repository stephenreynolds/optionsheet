import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  token: string;

  @Column()
  expiry: Date;

  @OneToOne(() => User, user => user.refreshToken, {
    eager: true,
    onDelete: "CASCADE"
  })
  @JoinColumn()
  user: User;

  get expired(): boolean {
    return this.expiry.getTime() < new Date().getTime();
  }
}