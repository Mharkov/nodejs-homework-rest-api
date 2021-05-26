const guard = (req, res, next) => {
  next();
};

module.exports = guard;
