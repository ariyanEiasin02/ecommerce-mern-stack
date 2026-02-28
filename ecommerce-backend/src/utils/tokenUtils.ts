import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (
  res: Response,
  statusCode: number,
  token: string,
  data: Record<string, unknown>
): void => {
  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE || '7');

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    ...data,
  });
};
