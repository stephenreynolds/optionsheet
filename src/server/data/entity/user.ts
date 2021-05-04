import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "./role";
import { JoinTable } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: false })
  emailConfirmed?: boolean;

  @Column()
  passwordHash: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];
}
