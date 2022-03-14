import { User } from "./user";

export class RefreshToken {
  token: string;
  expiry: Date;
  user: User;

  get expired(): boolean {
    return this.expiry.getTime() < new Date().getTime();
  }
}