import express from "express";
import * as ProductsController from "./products.controller.js";
import productValidationMiddleware, { runValidation } from "./productValidationMiddleware.js";
import upload from "../../utils/upload.middleware.js";
const router = express.Router();


router.get("/", productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAll);
router.delete("/:pid",productValidationMiddleware('isID'),runValidation, ProductsController.remove);
router.get("/:pid",productValidationMiddleware('isID'),runValidation, ProductsController.get);
router.post("/",upload.array("thumbnails",3), productValidationMiddleware('createProduct'),runValidation,ProductsController.create);
router.put("/:pid",productValidationMiddleware('updateProduct'),runValidation, ProductsController.update);
export default router;
