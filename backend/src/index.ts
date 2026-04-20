import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db";
import app from "./server";

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on [http://localhost:${PORT}]`);
  });
};

startServer();

console.log("Root index file is executing.");
