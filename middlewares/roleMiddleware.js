exports.checkRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Access denied. This resource is for ${role}s only.` });
  }
  next();
};