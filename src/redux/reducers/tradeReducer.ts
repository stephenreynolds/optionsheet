import {
  GET_TRADES_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL
} from "../actions/actionTypes";
import { Trade } from "../../common/models/trade";
import _ from "lodash";
import produce from "immer";

const getAllTradeTags = (trades: Trade[]) => {
  return _.uniq(trades
    .map((trade) => trade.tags)
    .flat());
};

interface TradeReducerState {
  trade: Trade;
  trades: Trade[];
  tags: string[];
}

const initialState: Readonly<Partial<TradeReducerState>> = {};

const tradeReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_TRADES_SUCCESS:
      state.trades = payload;
      state.tags = getAllTradeTags(payload);
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      state = { };
      break;
  }

  return state;
}, initialState);

export default tradeReducer;