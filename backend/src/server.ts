import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: "Welcome to the Crowdpullers Management API",
  });
});

export default app;
