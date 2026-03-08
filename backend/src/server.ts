import express, { Application, NextFunction, Request, Response } from "express";
import userRouter from "./user/user.routes";
import globalErrorHandler from "./middlewares/globalErrorHandlers";

const app: Application = express();
app.use(express.json());
app.use("/api/users", userRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: "Welcome to the Crowdpullers Management API",
  });
});

app.use(globalErrorHandler);

export default app;
