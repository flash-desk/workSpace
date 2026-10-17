import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

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

app.use("/",()=>{
  console.log("Server is running");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
