import express from "express";
import __dirname from "./utils.js";

import { Server } from "socket.io";
import Joi from "joi";
//importamos las rutas
import viewsRouter from "./routers/views.router.js";
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import handlebars_config from "./handlebars_config.js";
import ProductManager from "./productManager.js";
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
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const httpServer = app.listen("8080", () => {
  console.log("Server run in port: 8080 => http://localhost:8080/");
});

// Manejo de Handlebars
handlebars_config(app);
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

//manejo de Socket
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("Nuevo Cliente conectado");

  socket.on("getProducts", async (data) => {
    const pm = new ProductManager();
    const products = await pm.getProducts();
    //enviar los productos al cliente
    socket.emit("products", products);
  });

  socket.on("addNewProduct", async (data) => {
    console.log(data);
    const pm = new ProductManager();
    try {
      // Validar el cuerpo de la solicitud contra el esquema
    const validationResult = productAddSchema.validate(data, {
      abortEarly: false,
    });

    if (validationResult.error) {
      // Si hay errores de validación, enviar una respuesta con los errores
      return socket.emit ('error', {
        status:"error",
        errors: validationResult.error.details.map((error) => error.message),
      })
    }
      await pm.addProduct(data)
      const products = await pm.getProducts();
      //enviar los productos al cliente
      socket.emit("products", products);
    } catch (error) {
      socket.emit("error", {error});
    }
    
  });
});
