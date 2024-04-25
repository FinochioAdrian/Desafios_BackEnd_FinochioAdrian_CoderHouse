import express from "express";
import * as ProductsController from "./products.controller.js";
import productValidationMiddleware, { runValidation } from "./productValidationMiddleware.js";
import upload from "../../utils/upload.middleware.js";
import { auth } from "../../utils.js";
const router = express.Router();


router.get("/", auth(["user","admin"]),productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAll);
router.get("/mockingproducts", productValidationMiddleware('getAllQueries'),runValidation ,ProductsController.getAllMockingProducts);
router.get("/:pid",auth(["user","admin"]),productValidationMiddleware('isID'),runValidation, ProductsController.get);
router.post("/",auth(["admin"]),upload.array("thumbnails",3), productValidationMiddleware('createProduct'),runValidation,ProductsController.create);
router.put("/:pid",auth(["admin"]),productValidationMiddleware('updateProduct'),runValidation, ProductsController.update);
router.delete("/:pid",auth(["admin"]),productValidationMiddleware('isID'),runValidation, ProductsController.remove);
export default router;
