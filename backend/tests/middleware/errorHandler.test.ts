import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler, asyncHandler } from '../../src/middleware/errorHandler';

const createRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('errorHandler', () => {
  it('returns the AppError status and payload', () => {
    const res = createRes();
    const err = new AppError('Thing broke', 418);

    errorHandler(err, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(418);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('maps "not found" messages to 400', () => {
    const res = createRes();

    errorHandler(new Error('Bot with ID X not found'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('maps "Invalid" messages to 400', () => {
    const res = createRes();

    errorHandler(new Error('Invalid bot ID'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('falls through to a 500 for unexpected errors', () => {
    const res = createRes();

    errorHandler(new Error('boom'), {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });
});

describe('asyncHandler', () => {
  it('forwards rejections to next()', async () => {
    const next = jest.fn() as NextFunction;
    const err = new Error('async boom');
    const handler = asyncHandler(async () => {
      throw err;
    });

    await handler({} as Request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('invokes the wrapped function when it resolves', async () => {
    const next = jest.fn() as NextFunction;
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    await handler({} as Request, {} as Response, next);

    expect(fn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
