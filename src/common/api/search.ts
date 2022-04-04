import api from "./api";
import { SearchModel } from "../models/search";
import { TradeSearchProps } from "../../components/search/tradeCard";
import { Leg, PutCall, Side } from "../models/trade";
import { ProjectSearchProps } from "../../components/shared/projectCard";
import { UserSearchProps } from "../../components/search/userCard";

const parseSearchItems = (items: any[], type: string) => {
  switch (type) {
    case "trade":
      return items.map((trade) => {
        return {
          id: parseInt(trade.id),
          symbol: trade.symbol,
          openDate: new Date(trade.open_date),
          closeDate: trade.close_date ? new Date(trade.close_date) : undefined,
          openingNote: trade.opening_note ?? undefined,
          closingNote: trade.closing_note ?? undefined,
          legs: trade.legs.map((leg) => {
            return {
              side: Side[leg.side],
              quantity: parseFloat(leg.quantity),
              openPrice: parseFloat(leg.open_price),
              closePrice: leg.close_price ? parseFloat(leg.close_price) : undefined,
              strike: leg.strike ? parseFloat(leg.strike) : undefined,
              expiration: leg.expiration ? new Date(leg.expiration) : undefined,
              putCall: leg.put_call ? PutCall[leg.put_call] : undefined
            } as Leg;
          }),
          tags: trade.tags ?? [],
          projectName: trade.project_name,
          username: trade.username
        } as TradeSearchProps;
      });
    case "project":
      return items.map((project) => {
        return {
          name: project.name,
          description: project.description ?? undefined,
          updatedOn: new Date(project.updated_on),
          username: project.username,
          tags: project.tags ?? [],
          trades: parseInt(project.trades)
        } as ProjectSearchProps;
      });
    case "user":
      return items.map((user) => {
        return {
          username: user.username,
          avatarUrl: user.avatar_url ?? undefined,
          bio: user.bio ?? undefined,
          updatedOn: new Date(user.updated_on)
        } as UserSearchProps;
      });
  }

  return [];
};

export const search = async (params): Promise<SearchModel> => {
  const type = params.get("type") ?? "trade";

  return api.get("/search", { params })
    .then(({ data }) => {
      return {
        items: parseSearchItems(data.items, type),
        counts: {
          trades: parseInt(data.counts.trades),
          projects: parseInt(data.counts.projects),
          users: parseInt(data.counts.users)
        }
      } as SearchModel;
    });
};