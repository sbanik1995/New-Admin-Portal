// Middleware for checking if a session is authenticated.
exports.requireAuth = (req, res, next) => {
  if (!req.session || !req.session.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
  }
  return next();
};
