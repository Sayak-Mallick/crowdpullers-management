import { NextFunction, Response, Request } from "express";
const creatClient = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Client created successfully" });
};

export { creatClient };
