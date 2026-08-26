export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication Required",
      });
    }

    const userRole = req.user.role;

    if (roles.includes(userRole)) {
      return next();
    }

    if (userRole === "SUPER_ADMIN" && roles.includes("ADMIN")) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access Denied.",
    });
  };
};