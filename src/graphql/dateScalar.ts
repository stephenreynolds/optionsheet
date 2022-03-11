import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date scalar type",
  serialize(value: Date) {
    return value.getTime();
  },
  parseValue(value: number) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
});

export default dateScalar;