import httpStatus from 'http-status-codes';

export class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.payload = {
      code: httpStatus.getStatusText(statusCode),
      message,
    };
    if (details) {
      this.payload.details = details;
    }
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Oops, something went wrong on the server') {
    super(httpStatus.InternalServerError, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'The resource was not found') {
    super(httpStatus.NOT_FOUND, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(details) {
    super(httpStatus.BAD_REQUEST, 'One or more validations failed', details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(details) {
    super(httpStatus.UNAUTHORIZED, 'Unauthorized, need to ', details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(path = 'this resource') {
    super(
      httpStatus.FORBIDDEN,
      `Forbidden, you don't have permission to access ${path}`,
    );
  }
}

export class ConflictError extends HttpError {
  constructor(message, details = null) {
    super(httpStatus.CONFLICT, message, details);
  }
}
