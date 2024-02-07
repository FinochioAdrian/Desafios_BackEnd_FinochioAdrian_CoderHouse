import express from "express";
import * as ProductsController from "./products.controller.js";
const router = express.Router();

router.get("/", ProductsController.getAll);
router.get("/:pid", ProductsController.get);
router.post("/", ProductsController.create);
router.put("/:pid", ProductsController.update);
router.delete("/:pid", ProductsController.remove);
export default router;
