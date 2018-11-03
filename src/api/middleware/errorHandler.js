import httpStatus from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let { payload } = err;
  console.error('err', err, statusCode);

  // special case for 500 (internal server error)
  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    payload = {
      code: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
      message: 'Oops! something went wrong!',
    };
    payload.detail = { error: err.message, stack: err.stack };
  }

  res.status(statusCode).send(payload);
  next();
};

export default errorHandler;
