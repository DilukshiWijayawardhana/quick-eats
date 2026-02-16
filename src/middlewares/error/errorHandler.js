function errorHandler(err, req, res, next) {
  console.error(err.stack);
  console.error(err);

  const statusCode = err.statusCode || 500;
  let errorResponse = {
    message: err.message,
    details: err.details || "An unexpected error occurred",
  };

  // Handle Sequelize validation errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    errorResponse.details = err.errors.map((e) => ({
      message: e.message,
      path: e.path,
      value: e.value,
    }));
  }

  // Handle other types of errors
  // You can add more specific error handling logic here based on your requirements

  res.status(statusCode).send(errorResponse);
}

module.exports = errorHandler;
