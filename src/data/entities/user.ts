import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany
} from "typeorm";
import { Role } from "./role";
import { JoinTable } from "typeorm";
import { Project } from "./project";

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

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
    cascade: true
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Project, (project) => project.user, {
    onDelete: "CASCADE"
  })
  projects?: Project[];

  @Column({ default: "" })
  avatarUrl?: string;

  @Column({ default: "" })
  bio?: string;

  @Column({ default: new Date() })
  createdOn?: Date;

  @Column({ default: new Date() })
  updatedOn?: Date;
}
