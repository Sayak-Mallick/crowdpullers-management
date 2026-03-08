import "./src/server";
import app from "./src/server";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
  await connectDB();
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on [http://localhost:${PORT}]`);
  });
};

startServer();

console.log("Root index file is executing.");
