import { NextFunction, Response, Request } from "express"
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  // Basic Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, '😒 All fields are required');
    return next(error);
  }  // we can use express-validator for better validation

  // TODO: in the next version we will implement express-validator for better validation
  
  res.json({
    message: "✅ User registered successfully",
  })
}

export { createUser }