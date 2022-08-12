const methodNotAllowed = (req, res, next) =>
  next({ status: 500, message: "Method not allowed!" });

module.exports = methodNotAllowed;
