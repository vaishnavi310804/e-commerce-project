export const verifyServiceKey = (req, res, next) => {
  const serviceKey = req.headers["x-service-key"];

  if (!serviceKey || serviceKey !== process.env.INTERNAL_SERVICE_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized inter-service request. Invalid or missing service key.",
    });
  }

  next();
};
