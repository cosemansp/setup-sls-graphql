import { ApolloServer } from 'apollo-server-lambda';
import { withWarmup, withMongo } from '@/utils/middleware';
import compose from '@/utils/compose';
import schema from './schema';

// Create the Apollo GraphQL Server
const server = new ApolloServer({
  schema,
  context: ({ event, context }) => {
    // console.log(context.functionName, event.headers);
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    };
  },
});

// lambda function handler
const graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});

// export
export default compose(
  withWarmup,
  withMongo(process.env.MONGODB_URI),
)(graphqlHandler);
