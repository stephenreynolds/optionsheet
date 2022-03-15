import { getTradeQuantity } from "./tradeUtils";
import { Leg, Side } from "./models/trade";

describe("getTradeQuantity", () => {
  it("should return the lowest quantity out of all legs", () => {
    const legs: Leg[] = [
      { quantity: 1, side: Side.Buy, openPrice: 0 },
      { quantity: 2, side: Side.Buy, openPrice: 0 },
      { quantity: 3, side: Side.Buy, openPrice: 0 }
    ];
    const quantity = getTradeQuantity(legs);
    expect(quantity).toEqual(1);
  });

  describe("given a quantity of zero", () => {
    it("should return the lowest quantity out of all legs", () => {
      const legs: Leg[] = [
        { quantity: 0, side: Side.Buy, openPrice: 0 },
        { quantity: 2, side: Side.Buy, openPrice: 0 },
        { quantity: 3, side: Side.Buy, openPrice: 0 }
      ];
      const quantity = getTradeQuantity(legs);
      expect(quantity).toEqual(0);
    });
  });

  describe("given a negative quantity", () => {
    it("should return the lowest quantity", () => {
      const legs: Leg[] = [
        { quantity: 0, side: Side.Buy, openPrice: 0 },
        { quantity: -2, side: Side.Buy, openPrice: 0 },
        { quantity: 3, side: Side.Buy, openPrice: 0 }
      ];
      const quantity = getTradeQuantity(legs);
      expect(quantity).toEqual(-2);
    });
  });

  describe("given one leg", () => {
    it("should return the quantity", () => {
      const legs: Leg[] = [
        { quantity: 42, side: Side.Buy, openPrice: 0 }
      ];
      const quantity = getTradeQuantity(legs);
      expect(quantity).toEqual(42);
    });
  });

  describe("given zero legs", () => {
    it("should return zero", () => {
      const legs: Leg[] = [];
      const quantity = getTradeQuantity(legs);
      expect(quantity).toEqual(0);
    });
  });
});