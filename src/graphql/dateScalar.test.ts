import dateScalar from "./dateScalar";
import { Kind, ValueNode } from "graphql";

describe("dateScalar", () => {
    it("serializes Date to a number", () => {
        const date = new Date();
        const result = dateScalar.serialize(date);

        expect(typeof result).toBe("number");
    });

    it("parses number to a Date", () => {
        const time = 0;
        const result = dateScalar.parseValue(time);

        expect(result instanceof Date).toBe(true);
    });

    it("parses an int string to a Date", () => {
        const valueNode: ValueNode = {
            kind: Kind.INT,
            value: "1"
        };
        const result = dateScalar.parseLiteral(valueNode);
        expect(result instanceof Date).toBe(true);
    });

    it("return null if trying to parse a non-integer string", () => {
        const valueNode: ValueNode = {
            kind: Kind.STRING,
            value: "test"
        };
        const result = dateScalar.parseLiteral(valueNode);
        expect(result).toBeNull();
    });
});