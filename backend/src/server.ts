import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 200,
    message: 'Welcome to the Crowdpullers Management API',
  });
});

export default app;
