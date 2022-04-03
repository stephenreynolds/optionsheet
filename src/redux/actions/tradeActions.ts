import { Trade } from "../../common/models/trade";
import {
  GET_TRADES_SUCCESS
} from "./actionTypes";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import {
  getTrades as getTrades1
} from "../../common/api/trades";

export const getTrades = (username: string, projectName: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return getTrades1(username, projectName)
      .then((response) => {
        const trades = response.data.map((trade: Trade) => {
          return {
            ...trade,
            open_date: new Date(trade.open_date),
            close_date: trade.close_date ? new Date(trade.close_date) : null,
            created_on: new Date(trade.created_on),
            updated_on: new Date(trade.updated_on),
            legs: trade.legs.map((leg) => {
              return {
                ...leg,
                expiration: new Date(leg.expiration)
              };
            })
          };
        });
        dispatch({ type: GET_TRADES_SUCCESS, payload: trades });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};
