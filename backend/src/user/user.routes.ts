import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "./user.controller";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);

export default userRouter;
