const errorHandler = (err, req, res, next) => {
  console.error(err);

  const message =
    err.message ||
    err.error?.description ||
    err.description ||
    "Internal Server Error";

  return res.status(err.statusCode || 500).json({
    success: false,
    message,
  });
};

export default errorHandler;