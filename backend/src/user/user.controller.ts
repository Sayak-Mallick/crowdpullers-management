import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import userModel from "./user.model";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // Basic Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "😒 All fields are required");
    return next(error);
  } // we can use express-validator for better validation

  // TODO: in the next version we will implement express-validator for better validation

  // database call to check if user already exists
  const user = await userModel.findOne({ email: email });

  if (user) {
    const error = createHttpError(
      400,
      "😒 User with this email already exists",
    );
    return next(error);
  }

  // hashed password to ensure security of user data
  const hashedPassword = await bcrypt.hash(password, 10);

  // database call to create new user
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // jwt token generation for authentication
  const token = sign({ sub: newUser._id }, config.JWT_SECRET as string, {
    expiresIn: "10h",
    algorithm: "HS256",
  });

  res.json({
    accessToken: token,
    id: newUser._id,
    message: "✅ User registered successfully",
  });
};

export { createUser };
