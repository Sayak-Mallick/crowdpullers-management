import express, { Application, NextFunction, Request, Response } from "express";
import userRouter from "./user/user.routes";
import globalErrorHandler from "./middlewares/globalErrorHandlers";
import clientRouter from "./client/client.routes";
import cors from "cors";
import { config } from "./config/config";

const app: Application = express();
app.use(express.json());
app.use(cors({
  origin: config.frontendUrl,
}))

app.use("/api/users", userRouter);
app.use("/api/clients", clientRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: "Welcome to the Crowdpullers Management API",
  });
});

app.use(globalErrorHandler);

export default app;
