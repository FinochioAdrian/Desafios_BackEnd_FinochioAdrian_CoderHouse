import express from "express";
import ProductManager from "../productManager.js";
const router = express.Router();
const pm = new ProductManager()

router.get("/", async (req, res) => {
  const products = await pm.getProducts()
  
  res.render("home",{title:"home", products});
});
router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts",{title:"realTimeProducts"});
});

export default router;
