import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import ApiError from '../errors/ApiError';
import config from '../config';

// Consistent error response shape
type ErrorResponse = {
  success: false;
  message: string;
  errorDetails?: any;
  stack?: string;
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: any = null;

  // ─── 1. Custom ApiError ───
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ─── 2. Zod Validation Error ───
  else if (err?.name === 'ZodError' || err?.constructor?.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.issues?.map((issue: any) => ({
      path: issue.path?.join('.'),
      message: issue.message,
    }));
  }

  // ─── 3. Prisma Known Request Error (unique constraint, foreign key, etc.) ───
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2000':
        statusCode = 400;
        message = 'One of the values you entered is too long. Please shorten it and try again.';
        break;
      case 'P2002':
        statusCode = 409;
        message = 'This information already exists. Please use different details and try again.';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'The selected item could not be found. Please check your selection and try again.';
        break;
      case 'P2011':
        statusCode = 400;
        message = 'A required field is missing. Please fill in all required fields and try again.';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'This action cannot be completed because it is linked to other important data.';
        break;
      case 'P2020':
        statusCode = 400;
        message = 'The number you entered is too large or too small. Please enter a valid number.';
        break;
      case 'P2024':
        statusCode = 503;
        message = 'The server is busy right now. Please wait a moment and try again.';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'The requested item was not found. It may have been removed or does not exist.';
        break;
      case 'P2034':
        statusCode = 409;
        message = 'Your request conflicted with another operation. Please try again.';
        break;
      default:
        statusCode = 400;
        message = 'Something went wrong with your request. Please check your input and try again.';
    }
    errorDetails = { code: err.code, meta: err.meta };
  }

  // ─── 4. Prisma Validation Error (wrong field types, missing required fields) ───
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Database validation error. Please check your input data.';
    errorDetails = err.message;
  }

  // ─── 5. Prisma Not Found Error (findUniqueOrThrow, findFirstOrThrow) ───
  else if (err.name === 'NotFoundError' || err.constructor?.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Requested resource not found.';
  }

  // ─── 6. JSON Web Token Errors ───
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please login again.';
  }

  // ─── 7. Multer File Upload Errors ───
  else if (err.name === 'MulterError') {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File is too large.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = `Unexpected field: ${err.field}`;
        break;
      default:
        message = err.message;
    }
  }

  // ─── 8. JSON Syntax Error (malformed request body) ───
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body.';
  }

  // ─── 9. Type Error (usually programming bugs but can happen with bad input) ───
  else if (err instanceof TypeError) {
    statusCode = 500;
    message = 'An internal error occurred.';
  }

  // ─── 10. Generic / Unknown Error ───
  else if (err instanceof Error) {
    message = err.message;
  }

  // Build the response
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errorDetails) {
    response.errorDetails = errorDetails;
  }

  // Include stack trace only in development
  if (config.env === 'development' && err?.stack) {
    response.stack = err.stack;
  }

  // Log the error in development
  if (config.env === 'development') {
    console.error('🔥 ERROR:', err);
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
