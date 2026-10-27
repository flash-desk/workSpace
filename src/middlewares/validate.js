
import AppError from "../errors/AppError.js";
import httpStateText from "../utils/httpStateText.js";

const validate = (schema) => (req, res, next) => {
  const target = schema.body || schema.params || schema.query ? schema : { body: schema };

  for (const key of ["params", "query", "body"]) {
    if (!target[key]) continue;
    const result = target[key].safeParse(req[key]);
    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue.path.join(".") || key;
      return next(
        AppError.create(`${path}: ${issue.message}`, 422, httpStateText[422]),
      );
    }
    req[key] = result.data;
  }
  next();
};

export default validate;
