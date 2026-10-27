import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js"
import userRoutes from "./modules/users/users.routes.js";


const app = express();
app.use(
  cors({
    seurity: false,
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "OK" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
