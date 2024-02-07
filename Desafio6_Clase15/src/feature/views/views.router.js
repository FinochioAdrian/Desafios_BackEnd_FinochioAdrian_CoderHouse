import express from "express";
import * as ProductsController from '../products/products.controller.js'


const router = express.Router();



router.get("/", async (req, res) => {
  const products = await ProductsController.getAll()
  
  res.render("home",{title:"home", products});
});
router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts",{title:"realTimeProducts"});
});

export default router;
