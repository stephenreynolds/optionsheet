import jwt from "jsonwebtoken";
import {
  Column,
  Entity,
  getRepository,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
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

  @OneToOne(() => RefreshToken, refreshToken => refreshToken.user, {
    cascade: true,
    onDelete: "CASCADE"
  })
  refreshToken?: RefreshToken;

  async createToken(): Promise<string> {
    return jwt.sign({ id: this.id }, config.jwt.secret, {
      expiresIn: config.jwt.jwtExpiration
    });
  }

  async createRefreshToken(): Promise<string> {
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.jwtRefreshExpiration);

    const refreshTokenRepository = getRepository(RefreshToken);

    const existing = await refreshTokenRepository.findOne({ user: this });
    if (existing) {
      await refreshTokenRepository.remove(existing);
    }

    const refreshToken = await refreshTokenRepository.save({
      token: uuidv4(),
      expiry: expiredAt,
      user: this
    });

    return refreshToken.token;
  }
}