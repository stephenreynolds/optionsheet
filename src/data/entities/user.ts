import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Project } from "./project";
import { RefreshToken } from "./refreshToken";
import { Role } from "./role";

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

  @ManyToMany(() => Role, {
    eager: true,
    cascade: true
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Project, (project) => project.user, {
    onDelete: "CASCADE"
  })
  projects?: Project[];

  @Column()
  avatarUrl?: string;

  @Column()
  bio?: string;

  @Column({ default: new Date() })
  createdOn?: Date;

  @Column({ default: new Date() })
  updatedOn?: Date;

  @OneToOne(() => RefreshToken, refreshToken => refreshToken.user, {
    cascade: true,
    onDelete: "CASCADE"
  })
  refreshToken?: RefreshToken;
}