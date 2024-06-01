import express from "express";
import * as UsersController from "./users.controller.js";
import userValidationMiddleware, { runValidation } from "./userValidationMiddleware.js";
import { auth } from "../../utils.js";
const router = express.Router();


router.put("/premium/:uid",userValidationMiddleware("isID"),runValidation,UsersController.switchUserRole);

export default router;
