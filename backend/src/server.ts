import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/user.routes";
import clientRouter from "./clients/client.routes";
import eventRouter from "./events/events.routes";

const app: Application = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.crowdpullers.in",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/clients", clientRouter);
app.use("/api/events", eventRouter);

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
