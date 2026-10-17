import httpStateText from "../utils/httpStateText.js";

const globalErrorHandler = (error, req, res, next) => {
  console.log(error.message, {
    stack: error.stack,
    path: req?.originalUrl,
    method: req?.method,
  });
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStateText[500],
    message: error.message,
    data: null,
  });
};

export default globalErrorHandler;
