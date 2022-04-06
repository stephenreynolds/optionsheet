import api from "./api";
import { ProjectSearchProps, SearchModel, TradeSearchProps, UserSearchProps } from "../models/search";
import { parseTrade } from "./trades";
import { parseProject } from "./projects";
import { parseUser } from "./user";

const parseTradeResult = (data: any): TradeSearchProps => {
  return {
    ...parseTrade(data),
    projectName: data.project_name,
    username: data.username
  };
};

const parseProjectResult = (data: any): ProjectSearchProps => {
  return {
    ...parseProject(data),
    trades: parseInt(data.trades)
  };
};

const parseUserResult = (data: any): UserSearchProps => {
  return parseUser(data);
};

const SearchType = ["trade", "project", "user"] as const;
export type SearchType = typeof SearchType[number];
export const isSearchType = (type: unknown): type is SearchType => {
  return SearchType.indexOf(type as SearchType) !== -1;
};

export type SearchItems = TradeSearchProps[] | ProjectSearchProps[] | UserSearchProps[];

const parseSearchItems = (items: any[], type: SearchType): SearchItems => {
  switch (type.toLowerCase()) {
    case "project":
      return items.map((project) => parseProjectResult(project));
    case "user":
      return items.map((user) => parseUserResult(user));
  }

  return items.map((trade) => parseTradeResult(trade));
};

export const search = async (params): Promise<SearchModel> => {
  const type = params.get("type") ?? "trade";
  const searchType: SearchType = isSearchType(type) ? type : "trade";
  params.set("type", searchType);

  return api.get("/search", { params })
    .then(({ data }) => {
      const { items, counts } = data;
      return {
        items: parseSearchItems(items, searchType),
        counts: {
          trades: parseInt(counts.trades),
          projects: parseInt(counts.projects),
          users: parseInt(counts.users)
        }
      } as SearchModel;
    });
};