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
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.get
);
// create new cart
router.post(
  "/",
  cartValidationMiddleware("createCart"),
  runValidation,
  CartController.create
);
// Add new product in cart by cart id and product id
router.post(
  "/:cid/product/:pid",
  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.addProductInCart
);

//update one product in cart by cart id and product id

router.put(
  "/:cid/product/:pid",
  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.updateQuantityProductInCart
);

//update all product in cart by cart id
router.put(
  "/:cid",
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.updateProductsInCart
);
//delete product in cart by  id cart and id product
router.delete(
  "/:cid/product/:pid",
  
  cartValidationMiddleware("isCid"),
  cartValidationMiddleware("isPid"),
  runValidation,
  CartController.removeProductInCart
);
//delete cart by id
router.delete(
  "/:cid/",
  cartValidationMiddleware("isCid"),
  runValidation,
  CartController.removeCart
);

export default router;
