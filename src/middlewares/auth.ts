import { Request, Response, NextFunction } from 'express';
import { jwtHelper } from '../helpers/jwt';
import config from '../config';
import prisma from '../shared/prisma';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware to verify access token from cookies or Authorization header.
 * Attaches decoded user payload to req.user.
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from cookies (preferred) or Authorization header
    let token: string | undefined = req.cookies?.accessToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing',
      });
    }

    // 2. Verify token
    const decoded = jwtHelper.verifyToken(token, config.jwt.secret as string);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // 3. Ensure token payload has email and role
    const { email, role } = decoded as { email: string; role: string };
    if (!email || !role) {
      return res.status(401).json({
        success: false,
        message: 'Token payload missing required fields',
      });
    }

    // 4. Optionally verify user exists and is active (optional but recommended)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { status: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'User account is not active',
      });
    }

    // 5. Attach user to request
    req.user = { email, role };

    next();
  } catch (error) {
    // Token verification failed (expired, invalid signature, etc.)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: (error as Error).message,
    });
  }
};

/**
 * Role-based authorization middleware.
 * Restricts access to users with specific roles.
 * @param allowedRoles Array of roles allowed to access the route
 */
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};
