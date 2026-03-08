import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import userModel from "./user.model";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./user.types";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // Basic Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "😒 All fields are required");
    return next(error);
  } // we can use express-validator for better validation

  // TODO: in the next version we will implement express-validator for better validation

  // database call to check if user already exists
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(
        400,
        "😒 User with this email already exists",
      );
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "❌ Error while checking user existence"));
  }

  // hashed password to ensure security of user data
  const hashedPassword = await bcrypt.hash(password, 10);

  // database call to create new user
  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "❌ Error while creating user"));
  }

  // jwt token generation for authentication
  try {
    const token = sign({ sub: newUser._id }, config.JWT_SECRET as string, {
      expiresIn: "10h",
      algorithm: "HS256",
    });

    res.status(201).json({
      accessToken: token,
      id: newUser._id,
      message: "✅ User registered successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "❌ Error while generating access token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Basic Validation
  if (!email || !password) {
    const error = createHttpError(400, "😒 All fields are required");
    return next(error);
  }

  // database call to check if user exists
  let user: User | null;
  try {
    user = await userModel.findOne({ email: email });
    if (!user) {
      const error = createHttpError(404, "😒 User not Found");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "❌ Error while checking user existence"));
  }

  try {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error = createHttpError(400, "😒 Email or password is incorrect");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "❌ Error while comparing passwords"));
  }
 
  // jwt token generation for authentication
  try {
    const token = sign({ sub: user._id }, config.JWT_SECRET as string, {
      expiresIn: "10h",
      algorithm: "HS256",
    });

    res.status(201).json({
      accessToken: token,
      message: "✅ Logged in successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "❌ Error while generating access token"));
  }
};

export { createUser, loginUser };
