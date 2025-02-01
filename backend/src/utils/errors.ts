export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public data?: any
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ValidationError extends AppError {
  constructor(message: string, data?: any) {
    super(message, 422, 'VALIDATION_ERROR', data)
  }
}