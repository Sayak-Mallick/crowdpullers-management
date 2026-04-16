import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./user.model";
import { User } from "./user.types";
import { sign } from "jsonwebtoken";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "❌ Error while checking user existence"));
  }

  // Hashed Password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "❌ Error while creating user"));
  }

  try {
    const token = sign({ sub: newUser._id }, process.env.JWT_SECRET as string, {
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

  if (!email || !password) {
    const error = createHttpError(400, "😒 All fields are required");
    return next(error);
  }

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

  try {
    const token = sign({ sub: user._id }, process.env.JWT_SECRET as string, {
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

export { registerUser, loginUser };
