import httpStateText from "../utils/httpStateText.js";

const globalErrorHandler = (error, req, res, next) => {
  console.log(error.message, {
    stack: error.stack,
    path: req?.originalUrl,
    method: req?.method,
  });
  const isUploadError = error.name === "MulterError";
  const statusCode = error.statusCode || (isUploadError ? 400 : 500);
  res.status(statusCode).json({
    status: error.statusText || httpStateText[statusCode] || httpStateText[500],
    message: error.message,
    data: null,
  });
};

export default globalErrorHandler;
