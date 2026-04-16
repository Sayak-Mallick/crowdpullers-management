import "./server";
import app from "./server";
import { config } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
  await connectDB();
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on [http://localhost:${PORT}]`);
  });
};

startServer();

console.log("Root index file is executing.");
