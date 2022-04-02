import { Trade, TradeCreateModel, TradeUpdateModel } from "../../common/models/trade";
import {
  ADD_TRADE_SUCCESS,
  DELETE_TRADE_SUCCESS,
  GET_TRADE_SUCCESS,
  GET_TRADES_SUCCESS,
  UPDATE_TRADE_SUCCESS
} from "./actionTypes";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import {
  addTrade as addTrade1,
  deleteTradeById as deleteTradeById1,
  getTradeById as getTradeById1,
  getTrades as getTrades1,
  updateTradeById as updateTradeById1
} from "../../common/api/trades";

export const addTrade = (username: string, projectName: string, model: TradeCreateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return addTrade1(username, projectName, model)
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

export const getTradeById = (id: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return getTradeById1(id)
      .then((response) => {
        const trade: Trade = {
          ...response.data,
          open_date: new Date(response.data.open_date),
          close_date: response.data.closeDate ? new Date(response.data.close_date) : null,
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
    return updateTradeById1(id, model)
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
    return deleteTradeById1(id)
      .then(() => {
        dispatch({ type: DELETE_TRADE_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};