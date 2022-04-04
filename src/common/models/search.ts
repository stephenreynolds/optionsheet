import { TradeSearchProps } from "../../components/search/tradeCard";
import { ProjectSearchProps } from "../../components/shared/projectCard";
import { UserSearchProps } from "../../components/search/userCard";

export interface SearchModel {
  items: TradeSearchProps[] | ProjectSearchProps[] | UserSearchProps[];
  counts: {
    trades: number;
    projects: number;
    users: number;
  };
}