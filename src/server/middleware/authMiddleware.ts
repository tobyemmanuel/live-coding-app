import jwt from 'jsonwebtoken';
import user from '../models/User.js';
// import Session from "../models/Session.js";

// Middleware to protect user routes
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

// Middleware to protect admin routes
export const protectAdmin = async (req, res, next) => {
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
          message: 'admin no longer exists'
        });
      }

      if (!User.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'admin account is deactivated'
        });
      }

      if (User.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'admin does not have permission to access admin routes'
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

// Middleware to authorize user roles for specific routes (e.g., user, admin)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};


// export const checkSessionValidity = async (req, res, next) => {
//   try {
//     // Extract token from headers
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         status: "error",
//         message: "Authorization token is missing.",
//       });
//     }

//     console.debug("Token received:", token);

//     // Decode and verify the token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.debug("Decoded token:", decoded);
//     } catch (error) {
//       console.error("JWT Verification Error:", error);
//       return res.status(401).json({
//         status: "error",
//         message: "Invalid or expired token.",
//       });
//     }

//     // Check session in the database
//     const session = await Session.findOne({ where: { token } });
//     if (!session) {
//       console.warn("No session found for token:", token);
//       return res.status(401).json({
//         status: "error",
//         message: "Session not found or invalid token.",
//       });
//     }

//     console.debug("Session found:", session);

//     // Check if the session has expired
//     const currentTime = new Date();
//     const timeLimit = new Date(session.timeLimit);

//     console.debug("Current Time:", currentTime);
//     console.debug("Session Time Limit:", timeLimit);

//     if (currentTime >= timeLimit) {
//       console.info("Session expired, updating status to inactive...");
//       await Session.update({ status: "inactive" }, { where: { token } });

//       return res.status(401).json({
//         status: "error",
//         message: "Session has expired. Please log in again.",
//       });
//     }

//     // Check session status
//     if (session.status === "inactive") {
//       console.warn("Inactive session for token:", token);
//       return res.status(401).json({
//         status: "error",
//         message: "Session is not active.",
//       });
//     }

//     // Attach user information to the request object
//     req.user = { id: decoded.id, userId: session.userId };
//     console.debug("User attached to request:", req.user);

//     // Proceed to the next middleware
//     next();
//   } catch (error) {
//     console.error("Error in session validation middleware:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "An internal server error occurred.",
//     });
//   }
// };


