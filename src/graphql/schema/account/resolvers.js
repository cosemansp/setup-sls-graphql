import { db } from '@/utils/miniMongo';

// eslint-disable-next-line
export const resolvers = {
  Account: {
    id: (account) => account._id,
    estates: (account) => {
      return db.estates.find({ accountId: account._id }).toArray();
    },
  },
};
