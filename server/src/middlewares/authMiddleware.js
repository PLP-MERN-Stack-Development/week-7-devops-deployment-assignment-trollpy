const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const logger = require('../config/logger');

const clerkAuth = ClerkExpressWithAuth({
  onError: (error) => {
    logger.error('Clerk authentication error:', error);
  }
});

const requireAuth = (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    const userRole = req.auth?.sessionClaims?.role || 'viewer';
    if (userRole !== role && userRole !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  clerkAuth,
  requireAuth,
  requireRole
};