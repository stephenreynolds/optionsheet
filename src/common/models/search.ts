import { Leg } from "./trade";

export interface TradeSearchProps {
  id: number;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  legs: Leg[];
  tags: string[];
  projectName: number;
  username: string;
}

export interface ProjectSearchProps {
  name: string;
  description: string;
  updatedOn: Date;
  username: string;
  tags: string[];
  trades?: number;
}

export interface UserSearchProps {
  username: string;
  avatarUrl: string;
  bio: string;
  updatedOn: Date;
}

export interface SearchModel {
  items: TradeSearchProps[] | ProjectSearchProps[] | UserSearchProps[];
  counts: {
    trades: number;
    projects: number;
    users: number;
  };
}