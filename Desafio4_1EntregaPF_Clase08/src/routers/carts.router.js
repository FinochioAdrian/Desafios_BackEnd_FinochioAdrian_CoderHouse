import express from "express";
import ProductManager from "../productManager.js";
import CartManager from "../cartManager.js";

import Joi from "joi";

const router = express.Router();
const pm = new ProductManager();
const cm = new CartManager();

const cartAddSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().integer().strict(true).required(),
      })
    )
    .required(),
});
const productUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  code: Joi.string(),
  price: Joi.number(),
  status: Joi.boolean(),
  stock: Joi.number().integer().strict(true),
  category: Joi.string(),
  thumbnails: Joi.array().items(Joi.string()),
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!(req.params.cid.length === 20)) {
      res.status(400).send("Invalid Cart ID");
    }
    const cart = await cm.getCartById(cid);
    if (!cart)
      return res.status(404).json({ message: "No se encuentra el productos" });

      const products = await Promise.all(cart.products.map(async (prod) => {
        const product = await pm.getProductById(prod.id);
        product.quantity = prod.quantity;
        return product;
      }));
      
      
      
      res.send(products);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      status: "error",
      error: "Error obteniendo el producto.",
      msg: error.message,
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const { body } = req;
    // Validar el cuerpo de la solicitud contra el esquema
    const validationResult = cartAddSchema.validate(req.body, {
      abortEarly: false,
    });

    if (validationResult.error) {
      // Si hay errores de validación, enviar una respuesta con los errores
      return res.status(400).json({
        status: "error",
        errors: validationResult.error.details.map((error) => error.message),
      });
    }

    
    try {
      const payload = await cm.newCart({ ...body });
      res.status(201).send({ status: "success", payload });
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({ status: "error", error: error.message });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", error: "Error guardando el producto." });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    if (!req.params.cid){
      res.status(400).send({status:"Error",error:"No se proporciono un id cart valido"})
    }
    if (!req.params.pid){
      res.status(400).send({status:"Error",error:"No se proporciono un id producto valido"})
    }
    const { cid,pid } = req.params;

    const cart = await cm.getCartById(cid)    
    const product = await pm.getProductById(pid)
    await cm.updateCartFields(cart.id,product.id)
      
      res.status(201).send({ status: "success"});
    
  } catch (error) {
    console.error(error);
    res
      .status(error.status||500)
      .send({ status: "error", error: error.message });
  }
});

export default router;
