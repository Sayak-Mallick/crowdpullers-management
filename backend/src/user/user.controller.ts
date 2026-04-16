import { NextFunction, Response, Request } from "express";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {};

export { registerUser, loginUser };
