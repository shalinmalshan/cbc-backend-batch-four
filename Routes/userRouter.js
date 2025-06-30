import express from "express";
import { deleteUser, getUserDetails, getUsers, googleLogin, loginUser, saveUser, updateUserRole } from "../controllers/userController.js";

const userRouter= express.Router();

userRouter.post("/",saveUser)
userRouter.post("/login",loginUser)
userRouter.post("/google",googleLogin)
userRouter.get("/",getUsers)
userRouter.get("/getUserDetails",getUserDetails)
userRouter.put("/role/:email",updateUserRole)
userRouter.delete("/:email",deleteUser)
export default userRouter