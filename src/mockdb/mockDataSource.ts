import roles from "../mockdb/roles.json";
import userRoles from "../mockdb/userRoles.json";
import users from "../mockdb/users.json";
import projects from "../mockdb/projects.json";
import trades from "../mockdb/trades.json";
import legs from "../mockdb/legs.json";
import { UserRole } from "../models/userRole";
import { User } from "../models/user";
import { Role } from "../models/role";
import { Trade } from "../models/trade";
import { Project } from "../models/project";
import { Leg, PutCall, Side } from "../models/leg";
import { v4 as uuidv4 } from "uuid";
import { DataSource } from "apollo-datasource";

export class MockDataSource extends DataSource {
  private readonly roles: Role[];
  private readonly userRoles: UserRole[];
  private readonly users: User[];
  private readonly projects: Project[];
  private readonly trades: Trade[];
  private readonly legs: Leg[];

  constructor() {
    super();

    this.roles = roles;
    this.userRoles = userRoles;
    this.users = users;
    this.projects = projects.map(project => {
      return {
        ...project,
        lastEdited: new Date(project.lastEdited)
      }
    });
    this.trades = trades.map(trade => {
      return {
        ...trade,
        id: trade.id.toString(),
        openDate: new Date(trade.openDate),
        closeDate: trade.closeDate ? new Date(trade.closeDate) : undefined
      }
    });
    this.legs = legs.map(leg => {
      return {
        ...leg,
        id: leg.id.toString(),
        side: Side[leg.side],
        putCall: leg.putCall ? PutCall[leg.putCall] : undefined,
        expiration: leg.expiration ? new Date(leg.expiration) : undefined,
        tradeId: leg.tradeId ? leg.tradeId.toString() : undefined
      }
    });
  }

  getRoles = (): Role[] => this.roles;

  getUserRoles = (): UserRole[] => this.userRoles;

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

    user.roles.map(role => {
      this.userRoles.push({ roleId: role.roleId, userId: id });
    });

    return newUser;
  };
}