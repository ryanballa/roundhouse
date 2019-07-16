export function loginRequired(req, res, next) {
  if (!req.userContext) {
    req.error = { error: 'User is not authorized.'};
    req.statusCode = 401;
    res.status(401);
  }
  next();
}
