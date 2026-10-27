import AppError from "../errors/AppError.js";
import httpStateText from "../utils/httpStateText.js";

export default function requirePermission(...keys) {
  return (req, res, next) => {
    const granted = req.currentUser?.permissions || [];
    if (!keys.every((key) => granted.includes(key))) {
      return next(
        AppError.create(
          "You do not have permission to perform this action",
          403,
          httpStateText[403],
        ),
      );
    }
    next();
  };
}
