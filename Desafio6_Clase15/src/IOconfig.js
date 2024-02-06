import { Server } from "socket.io";
import Joi from "joi";
import ProductManager from "./dao/productManager.js";
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

 const IOinit = (httpServer) => {
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
        socket.emit("error", error);
      }
      
    });
  });

  }
  
  export default IOinit