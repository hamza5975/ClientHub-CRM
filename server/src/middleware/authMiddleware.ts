import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(new Error('Not authenticated'), { statusCode: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.userId = decoded.id;
    next();
  } catch (err) {
    if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
      res.status(401).json({ success: false, error: 'Invalid or expired token', statusCode: 401 });
      return;
    }
    next(err);
  }
}

export function authorize(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        throw Object.assign(new Error('Not authenticated'), { statusCode: 401 });
      }
      
      // Import User model dynamically to avoid circular dependencies
      const User = (await import('../models/User')).default;
      const user = await User.findById(req.userId);
      
      if (!user) {
        throw Object.assign(new Error('User not found'), { statusCode: 404 });
      }
      
      req.userRole = user.role;
      
      if (roles.length > 0 && !roles.includes(user.role)) {
        throw Object.assign(new Error('Insufficient permissions'), { statusCode: 403 });
      }
      
      next();
    } catch (err) {
      next(err);
    }
  };
}
