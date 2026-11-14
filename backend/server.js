import "dotenv/config"; // MUST be the first import — loads .env before any other module runs
import mongoose from "mongoose";
import app from "./src/app.js";

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    app.listen(process.env.PORT_NUMBER, () => {
      console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
    });
  } catch (error) {
    console.log("Database connection failed", {
      error: error.message,
      stack: error.stack,
    });
  }
};

startServer();
