const roleMiddleware = (roles) => {
  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ Blocked: user role not allowed or missing req.user");
      return res.status(403).json({
        status: 403,
        message: "Forbidden, unauthorized user",
      });
    }

    console.log("✅ Passed role check:", req.user.role);
    next();
  };
};

module.exports = roleMiddleware;
