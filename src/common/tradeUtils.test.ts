import { formatPrice, getFirstExpiration, getTradeQuantity } from "./tradeUtils";
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

describe("getFirstExpiration", () => {
  describe("given zero legs", () => {
    it("should return undefined", () => {
      const legs: Leg[] = [];
      const firstExpiration = getFirstExpiration(legs);
      expect(firstExpiration).toEqual(undefined);
    });
  });

  describe("given one leg with no expiration", () => {
    it("should return undefined", () => {
      const legs: Leg[] = [{ quantity: 42, side: Side.Buy, openPrice: 0 }];
      const firstExpiration = getFirstExpiration(legs);
      expect(firstExpiration).toEqual(undefined);
    });
  });

  describe("given two expirations", () => {
    it("should return the earliest of the two", () => {
      const first = new Date(new Date().getTime() - 1);
      const second = new Date();
      const legs: Leg[] = [
        { quantity: 1, side: Side.Buy, openPrice: 0, expiration: first },
        { quantity: 2, side: Side.Sell, openPrice: 0, expiration: second }
      ];
      const firstExpiration = getFirstExpiration(legs);
      expect(firstExpiration).toEqual(first);
    });

    describe("given one expiration is undefined", () => {
      it("should return undefined", () => {
        const legs: Leg[] = [
          { quantity: 1, side: Side.Buy, openPrice: 0, expiration: new Date() },
          { quantity: 2, side: Side.Sell, openPrice: 0, expiration: undefined }
        ];
        const firstExpiration = getFirstExpiration(legs);
        expect(firstExpiration).toEqual(undefined);
      });
    });
  });
});

describe("formatPrice", () => {
  describe("price is zero", () => {
    it("should return '0.00'", () => {
      const result = formatPrice(0);
      expect(result).toEqual("0.00");
    });
  });

  describe("price is one", () => {
    it("should return '1.00'", () => {
      const result = formatPrice(1);
      expect(result).toEqual("1.00");
    });
  });

  describe("price is 100", () => {
    it("should return '100.00'", () => {
      const result = formatPrice(100);
      expect(result).toEqual("100.00");
    });
  });

  describe("price is negative", () => {
    it("should return '-1.00'", () => {
      const result = formatPrice(-1);
      expect(result).toEqual("-1.00");
    });
  });

  describe("price is NaN", () => {
    it("should return '--'", () => {
      const result = formatPrice(NaN);
      expect(result).toEqual("--");
    });
  });

  describe("price is Infinity", () => {
    it("should return '--'", () => {
      const result = formatPrice(Infinity);
      expect(result).toEqual("Unlimited");
    });
  });

  describe("price is -Infinity", () => {
    it("should return '--'", () => {
      const result = formatPrice(-Infinity);
      expect(result).toEqual("Unlimited");
    });
  });

  describe("given 1 and zero digits", () => {
    it("should return '1'", () => {
      const result = formatPrice(1, 0);
      expect(result).toEqual("1");
    });
  });
});