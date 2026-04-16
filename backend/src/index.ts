import app from "./server";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on [http://localhost:${PORT}]`);
  });
};

startServer();

console.log("Root index file is executing.");
