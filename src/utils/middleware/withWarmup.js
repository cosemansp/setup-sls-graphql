const withWarmup = (handler) => (event, context, callback) => {
  // Immediate response for WarmUP plugin
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    if (callback) {
      callback('Lambda is warm!');
    }
    return 'Lambda is warm!';
  }
  return handler(event, context, callback);
};

export default withWarmup;
