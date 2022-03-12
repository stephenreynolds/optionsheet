import users from "../mockdb/users.json";
import projects from "../mockdb/projects.json";
import trades from "../mockdb/trades.json";
import legs from "../mockdb/legs.json";
import { User } from "../models/user";
import { Trade } from "../models/trade";
import { Project } from "../models/project";
import { Leg, PutCall, Side } from "../models/leg";
import { v4 as uuidv4 } from "uuid";

export class MockDb {
  private users: User[];
  private projects: Project[];
  private trades: Trade[];
  private legs: Leg[];

  constructor() {
    this.users = users;
    this.projects = projects.map(project => {
      return {
        ...project,
        lastEdited: new Date(project.lastEdited)
      };
    });
    this.trades = trades.map(trade => {
      return {
        ...trade,
        id: trade.id.toString(),
        openDate: new Date(trade.openDate),
        closeDate: trade.closeDate ? new Date(trade.closeDate) : undefined
      };
    });
    this.legs = legs.map(leg => {
      return {
        ...leg,
        id: leg.id.toString(),
        side: Side[leg.side],
        putCall: leg.putCall ? PutCall[leg.putCall] : undefined,
        expiration: leg.expiration ? new Date(leg.expiration) : undefined,
        tradeId: leg.tradeId ? leg.tradeId.toString() : undefined
      };
    });
  }

  getUsers = (): User[] => this.users;

  getProjects = (): Project[] => this.projects.map(p => {
    return {
      ...p,
      lastEdited: new Date(p.lastEdited)
    };
  });

  getTrades = (): Trade[] => this.trades.map(t => {
    return {
      ...t,
      openDate: new Date(t.openDate),
      closeDate: t.closeDate ? new Date(t.closeDate) : undefined
    };
  });

  getLegs = (): Leg[] => this.legs.map(l => {
    return {
      ...l,
      side: Side[l.side],
      putCall: l.putCall ? PutCall[l.putCall] : undefined,
      expiration: l.expiration ? new Date(l.expiration) : undefined
    };
  });

  insertUser = (user) => {
    const id = uuidv4();
    const newUser: User = { ...user, id, emailConfirmed: false };
    this.users.push(newUser);

    return newUser;
  };

  updateUser = (userId, data) => {
    this.users.findIndex(user => user.id === userId);
    const user = this.users[userId];
    this.users[userId] = { ...user, ...data };
    return this.users[userId];
  };
}