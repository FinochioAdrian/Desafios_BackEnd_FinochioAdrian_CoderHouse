import express from "express";
import * as ProductsController from "./products.controller.js";
import { query} from 'express-validator'
import productValidationMiddleware, { runValidation } from "./productValidationMiddleware.js";
const router = express.Router();


router.get("/", productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAll);
router.get("/:pid",productValidationMiddleware('isID'),runValidation, ProductsController.get);
router.post("/", productValidationMiddleware('createProduct'),runValidation,ProductsController.create);
router.put("/:pid",productValidationMiddleware('createProduct'),runValidation, ProductsController.update);
router.delete("/:pid", ProductsController.remove);
export default router;
