function auth(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).json("Please log in to continue");
  }
  next();
}

module.exports = auth;
