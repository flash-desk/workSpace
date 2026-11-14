import appError from "../errors/AppError.js";
import httpStateText from "../utils/httpStateText.js";


export default function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role))
      return next(
        appError.create("this role is not authorized", 403, httpStateText[403]),
      );
    next();
  };
}
