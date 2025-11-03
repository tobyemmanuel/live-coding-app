import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import user from '../models/user.js';
import role from '../models/role.js';
export const protectUser = async (req, res, next) => {
  try {
    let token;
    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token and get user ID
      const User = await user.findByPk(decoded.id); // Fetch user by ID from DB

      if (!User) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists'
        });
      }

      if (!User.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is deactivated'
        });
      }

      req.user = User; // Attach user data to request
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired'
        });
      }
      return res.status(401).json({
        status: 'error',
        message: 'Token is invalid or expired',
        data: error
      });
    }
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
      }

      const userRoleId = req.user.role_id;

      const dbRole = await role.findOne({ where: { id: userRoleId } });

      if (!dbRole || !allowedRoles.includes(dbRole.name)) {
        return res.status(403).json({
          status: 'error',
          message: `Role '${dbRole?.name || 'unknown'}' is not authorized to access this route`
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Authorization failed',
        error: err.message,
      });
    }
  };
};

