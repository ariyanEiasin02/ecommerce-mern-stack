import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
  role: string;
}

// Protect routes - require authentication
export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in cookies first, then Authorization header
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return next(
        new AppError('Your account has been blocked. Contact support.', 403)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized. Invalid token.', 401));
  }
};

// Authorize by role
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};
