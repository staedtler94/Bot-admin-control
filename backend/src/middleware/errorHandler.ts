import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // Validation errors
  if (err.message.includes('not found') || err.message.includes('Invalid')) {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        statusCode: 400,
      },
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && { debug: err.message }),
    },
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
