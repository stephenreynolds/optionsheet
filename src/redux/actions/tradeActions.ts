import { Trade, TradeCreateModel, TradeUpdateModel } from "../../common/models/trade";
import * as projectApi from "../../common/projectApi";
import {
  ADD_TRADE_SUCCESS,
  DELETE_TRADE_SUCCESS,
  GET_TRADE_SUCCESS,
  GET_TRADES_SUCCESS,
  UPDATE_TRADE_SUCCESS
} from "./actionTypes";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const addTrade = (username: string, projectName: string, model: TradeCreateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .addTrade(username, projectName, model)
      .then(() => {
        dispatch({ type: ADD_TRADE_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const getTrades = (username: string, projectName: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .getTrades(username, projectName)
      .then((response) => {
        const trades = response.data.map((trade: Trade) => {
          return {
            ...trade,
            openDate: new Date(trade.openDate),
            closeDate: trade.closeDate ? new Date(trade.closeDate) : null,
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

export const getTradeById = (id: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .getTradeById(id)
      .then((response) => {
        const trade: Trade = {
          ...response.data,
          openDate: new Date(response.data.openDate),
          closeDate: response.data.closeDate ? new Date(response.data.closeDate) : null,
          legs: response.data.legs.map((leg) => {
            return {
              ...leg,
              expiration: new Date(leg.expiration)
            };
          })
        };
        dispatch({ type: GET_TRADE_SUCCESS, payload: trade });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const updateTradeById = (id: string, model: TradeUpdateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .updateTradeById(id, model)
      .then(() => {
        dispatch({ type: UPDATE_TRADE_SUCCESS, payload: model });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const deleteTradeById = (id: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .deleteTradeById(id)
      .then(() => {
        dispatch({ type: DELETE_TRADE_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};