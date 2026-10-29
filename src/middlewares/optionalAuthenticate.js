// like authenticate.js, but a missing/invalid token just means "guest" —
// used on public routes that behave differently for logged-in users (Explore, workspace details)
import jwt from "jsonwebtoken";
import User from "../modules/users/users.model.js";

export default async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decodedToken.id);
    if (user) req.currentUser = decodedToken;
  } catch {
    // treat as guest
  }
  next();
};
