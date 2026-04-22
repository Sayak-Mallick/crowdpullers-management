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
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/clients", clientRouter);
app.use("/api/events", eventRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: 200,
    message: "Welcome to the Crowdpullers Management API",
  });
});

// ── Health check used by keep-alive ping ───────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: 200, message: "OK" });
});

app.use(globalErrorHandler);

// ── Free-tier keep-alive: ping /health every 14 min so Render doesn't sleep ────
// Only enable in production. Render's free tier sleeps after 15 min of inactivity.
if (process.env.NODE_ENV !== "development" && process.env.SERVER_URL) {
  const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

  setInterval(async () => {
    try {
      await fetch(`${process.env.SERVER_URL}/health`);
      console.log("🏓 Keep-alive ping sent");
    } catch (err) {
      console.warn("⚠️ Keep-alive ping failed:", err);
    }
  }, PING_INTERVAL_MS);
}

export default app;
