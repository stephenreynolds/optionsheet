import { Leg, PutCall, Side } from "../../../../common/models/trade";
import { ChangeEvent, MouseEvent } from "react";

export const symbolIsValid = (symbol: string): boolean => {
  const regexp = new RegExp("^[a-zA-Z]+(\\.[a-zA-Z]+)?$");
  return regexp.test(symbol) && symbol.length <= 5;
};

export const closeDateIsValid = (open: Date, close: Date): boolean => {
  return close.getTime() - open.getTime() >= 0;
};

export const legStrikesAreValid = (legs: Leg[]): boolean => {
  for (const { strike } of legs) {
    if (isNaN(strike)) {
      return false;
    }
  }

  return true;
};

export const onSymbolChange = (e: ChangeEvent<HTMLInputElement>, setSymbol: (symbol: string) => void) => {
  const str = e.target.value.toUpperCase();
  const regexp = new RegExp("^(?!\\.)[a-zA-Z]*\\.?[a-zA-Z]*$");

  if (regexp.test(str) && str.length <= 5) {
    setSymbol(str);
  }
};

export const onTradeDateChange = (date: Date, setDate: (date: Date) => void) => {
  setDate(date);
};

export const onNoteChange = (e: ChangeEvent<HTMLTextAreaElement>, setNote: (note: string) => void) => {
  setNote(e.target.value);
};

export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const initialLegValues: Leg = {
  side: Side.Buy,
  putCall: PutCall.Call,
  quantity: 1,
  expiration: addDays(new Date(), 45),
  strike: NaN,
  openPrice: NaN
};

export const onAddLegClick = (e: MouseEvent, legs: Leg[], setLegs: (legs: Leg[]) => void) => {
  e.preventDefault();

  if (legs.length < 4) {
    setLegs([
      ...legs,
      {
        ...initialLegValues,
        expiration: legs[legs.length - 1].expiration
      }
    ]);
  }
};

export enum StrategyOptions {
  Shares = "Shares",
  Call = "Call",
  Put = "Put",
  Vertical = "Vertical",
  Diagonal = "Diagonal",
  Calendar = "Calendar",
  IronCondor = "Iron Condor",
  DoubleDiagonal = "Double Diagonal",
  Strangle = "Strangle",
  Straddle = "Straddle",
  Butterfly = "Butterfly",
  Ratio = "Ratio"
}

export const onStrategyChange = (e, setStrategy, setLegs, openDate) => {
  const strategy = StrategyOptions[e.target.value];
  setStrategy(e.target.value);

  const defaultExpiration = addDays(openDate, 45);

  // TODO: Add stock and covered stock
  switch (strategy) {
    case StrategyOptions.Shares:
      setLegs([
        {
          side: Side.Buy,
          quantity: 1,
          open_price: NaN
        }
      ]);
      return;
    case StrategyOptions.Call:
      setLegs([{
        ...initialLegValues,
        side: Side.Buy,
        put_call: PutCall.Call,
        expiration: defaultExpiration
      }]);
      return;
    case StrategyOptions.Put:
      setLegs([{
        ...initialLegValues,
        side: Side.Buy,
        put_call: PutCall.Put,
        expiration: defaultExpiration
      }]);
      return;
    case StrategyOptions.Vertical:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        }
      ]);
      return;
    case StrategyOptions.IronCondor:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Put,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Put,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        }
      ]);
      return;
    case StrategyOptions.Diagonal:
    case StrategyOptions.Calendar:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          expiration: addDays(openDate, 30)
        },
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: addDays(openDate, 60)
        }
      ]);
      return;
    case StrategyOptions.Strangle:
    case StrategyOptions.Straddle:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Put,
          expiration: defaultExpiration
        }
      ]);
      return;
    case StrategyOptions.Butterfly:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          quantity: 2,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        }
      ]);
      return;
    case StrategyOptions.DoubleDiagonal:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          expiration: addDays(openDate, 30)
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Put,
          expiration: addDays(openDate, 30)
        },
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: addDays(openDate, 60)
        },
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Put,
          expiration: addDays(openDate, 60)
        }
      ]);
      return;
    case StrategyOptions.Ratio:
      setLegs([
        {
          ...initialLegValues,
          side: Side.Buy,
          put_call: PutCall.Call,
          expiration: defaultExpiration
        },
        {
          ...initialLegValues,
          side: Side.Sell,
          put_call: PutCall.Call,
          quantity: 2,
          expiration: defaultExpiration
        }
      ]);
      return;
    default:
      return;
  }
};