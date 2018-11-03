import { MongoUri, db } from '../miniMongo';

export default (uri) => (handler) => (event, context, callback) => {
  // Allows a Lambda function to return its result to the caller without requiring
  // that the MongoDB database connection be closed.
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line

  // Open database
  const mongoUri = MongoUri.parse(uri);
  const promise = db
    .connect(mongoUri)
    .then(() => {
      db.bind('products');
      db.bind('estates');
      db.bind('activities');
      db.bind('accounts');
      // db successfull opened, continue with rest of handler
      return handler(event, context, callback);
    })
    .catch((err) => {
      // db failed to open, just return error
      if (callback) {
        return callback(err);
      }
      throw err; // promise is used
    });
  return !callback ? promise : null;
};
