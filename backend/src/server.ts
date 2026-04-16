import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/user.routes";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api/users", userRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: "Welcome to the Crowdpullers Management API",
  });
});

app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: "OK",
  });
});

app.use(globalErrorHandler);

export default app;
