import { makeExecutableSchema } from 'graphql-tools';

import { typedefs as Account, resolvers as accountResolvers } from './account';
import { typedefs as Estate, resolvers as estateResolvers } from './estate';
import { DateTime } from './scalar';
import { db } from '@/utils/miniMongo';

const Query = `
  scalar DateTime

  type Query {
    account(id: ID!): Account
    estate(id: ID!): Estate
  }

  type Mutation {
    updateAccount(input: UpdateAccountInput!): UpdateAccountPayload
    addEstate(input: AddEstateInput!): AddEstatePayload
  }
`;

const rootResolvers = {
  DateTime,
  Query: {
    account: (_, { id }) => {
      return db.accounts.$findById(id);
    },
    estate: (_, { id }) => {
      return db.estates.$findById(id);
    },
  },
  Mutation: {
    updateAccount: async (_, { input }) => {
      const accountId = '9999'; // should come from access token
      const account = await db.accounts.$findByIdAndUpdate(accountId, input);
      return { account };
    },
    addEstate: async (_, { input }) => {
      const accountId = '9999'; // should come from access token
      const estate = await db.estates.$insertOne({
        ...input,
        accountId,
      });
      return { estate };
    },
  },
};

export default makeExecutableSchema({
  typeDefs: [Query, Account, Estate],
  resolvers: [rootResolvers, accountResolvers, estateResolvers],
});
