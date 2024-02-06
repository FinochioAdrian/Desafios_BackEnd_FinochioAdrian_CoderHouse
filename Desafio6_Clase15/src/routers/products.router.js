import express from "express";
import ProductManager from "../dao/productManager.js";
import Joi from "joi";
const router = express.Router();
const pm = new ProductManager();
const productAddSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()),
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().strict(true).required(),
  status: Joi.boolean().default(true),
  stock: Joi.number().integer().strict(true).required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.string()),
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
router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    //Comprobamos la existencia del query.limit
    if (req.query && req.query.limit) {
      let { limit } = req.query;
      limit = parseInt(limit, 10);
      //verificar si es un numero valido
      if (!isNaN(limit) && limit > 0) {
        //aplicar limite a la lista de productos
        let limitedProducts = products.slice(0, limit);
        return res.send({ products: limitedProducts });
      } else {
        return res.status(400).send({
          status:"error",
          error: 'El parámetro "limit" debe ser un número entero positivo.',
        });
      }
    }
    res.send({ ...products });
  } catch (error) {
    console.error(error);
    res.status(error.status||500).send({ error: error.message });
  }
});
router.get("/:pid", async (req, res) => {
  try {
    /* const products = await pm.getProductById(req); */
    //Comprobamos la existencia del query.limit
    if (req.params && req.params.pid) {
      let { pid } = req.params;
      
      
        try {
          let productFound = await pm.getProductById(pid);

          // Producto encontrado, enviarlo en la respuesta
          return res.send({ ...productFound });
        } catch (error) {
          // Manejar el error específico cuando el producto no se encuentra
          return res.status(404).send({
            status:"error",
            error: `El producto con el id ${pid} no se encuentra.`,
          });
        }
      
    } else {
      return res.status(400).send({
        status:"error",
        error: "Se requiere el parámetro id de búsqueda en la URL.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status||500).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { body } = req;
    // Validar el cuerpo de la solicitud contra el esquema
    const validationResult = productAddSchema.validate(req.body, {
      abortEarly: false,
    });

    if (validationResult.error) {
      // Si hay errores de validación, enviar una respuesta con los errores
      return res.status(400).json({
        status:"error",
        errors: validationResult.error.details.map((error) => error.message),
      });
    }
    try {
      const payload = await pm.addProduct({ ...body });
      res.status(201).send({ status: 201, payload });
    } catch (error) {
      console.log(error.message);
      return res.status(400).send({ status:"error", error: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status:"error", error: "Error guardando el producto." });
  }
});

router.put("/:pid", async (req, res) => {
 
  try {
        //Comprobamos la existencia pid

    if (!req.params || !req.params.pid) {
      return res.status(400).send({
        status:"error",
        error: "Se requiere el parámetro id de búsqueda en la URL.",
      });
    }

    let { pid } = req.params;
    // comprobamos que el pid sea del tipo string 
    if (!typeof pid === "string") {
      return res.status(400).send({
        status:"error",
        error: "El parámetro no es un id de producto valido.",
      });
    }
       const product = req.body

    // Validar el cuerpo de la solicitud contra el esquema
    const validationResult = productUpdateSchema.validate(product, {
      abortEarly: false,
    });

    if (validationResult.error) {
      // Si hay errores de validación, enviar una respuesta con los errores
      return res.status(400).json({
        status:"error",
        errors: validationResult.error.details.map((error) => error.message),
      });
    }
 
    try {
      // actualizar producto
      let productUpdate = await pm.updateProductFields(pid,product);

      // Producto encontrado, enviarlo en la respuesta
      return res.send({status:200,payload:productUpdate });
    } catch (error) {
      // Manejar el error específico cuando el producto no se encuentra
      return res.status(404).send({ status:404,
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al actualizar producto." });
  }
});

router.delete("/:pid", async (req, res) => {
 
  try {
    //Comprobamos la existencia pid
    if (!req.params && req.params.pid) {
      return res.status(400).send({
        status:"error",
        error: "Se requiere el parámetro id de búsqueda en la URL.",
      });
    }

    let { pid } = req.params;
    // comprobamos que el pid sea del tipo string 
    if (!typeof pid === "string") {
      return res.status(400).send({
        status:"error",
        error: "El parámetro no es un id de producto valido.",
      });
    }
    
   
      // Eliminar producto
      await pm.deleteProductByID(pid);

      // Producto encontrado, enviarlo en la respuesta
      return res.status(201).send({status:"success", msg:`producto con id ${pid} fue eliminado ` });
    
      
    
  } catch (error) {
    console.error(`Error capturado: ${error.message}`);
    console.error(`Código de estado: ${error.status || 'No definido'}`);
    
    res.status(error.status||500).send({ status:"error",message: error.message });
  }
});
export default router;
