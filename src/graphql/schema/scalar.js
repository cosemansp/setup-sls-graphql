import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

// eslint-disable-next-line
export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    if (value) {
      // sample to show Epoch time
      // return value.getTime(); // value sent to the client
      return value.toISOString();
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});
