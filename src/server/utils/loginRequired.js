function loginRequired(req, res, next) {
  if (!req.user) {
    req.error = { error: 'User is not authorized.' };
    req.statusCode = 401;
    res.status(401);
  }
  next();
}

module.exports = {
  loginRequired,
};
