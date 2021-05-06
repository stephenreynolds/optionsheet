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

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Project, (project) => project.user, {
    onDelete: "CASCADE"
  })
  projects?: Project[];

  @Column({ nullable: true })
  imageUrl?: string;
}
