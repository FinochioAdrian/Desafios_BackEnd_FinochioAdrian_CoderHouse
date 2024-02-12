import express from "express";

import * as CartController from "./cart.controller.js";
import cartValidationMiddleware, {
  runValidation,
} from "./cartValidationMiddleware.js";

const router = express.Router();

router.get(
  "/",
  cartValidationMiddleware("getAll"),
  runValidation,
  CartController.getAll
);
router.get(
  "/:cid",
  cartValidationMiddleware("isID"),
  runValidation,
  CartController.get
);
router.post(
  "/",
  cartValidationMiddleware("createCart"),
  runValidation,
  CartController.create
);

router.post(
  "/:cid/product/:pid",
  cartValidationMiddleware("isCid,isPid"),
  runValidation,
  CartController.addProductInCart
);
router.delete(
  "/:cid/product/:pid",
  cartValidationMiddleware("isCid,isPid"),
  runValidation,
  CartController.removeProductInCart
);
router.delete(
  "/:cid/",
  cartValidationMiddleware("isID"),
  runValidation,
  CartController.removeCart
);

export default router;
