import { Server } from "socket.io";
import Messages from "../feature/messages/messages.dao.js";
import validator from "validator";
const { isEmail, isEmpty } = validator;
import Joi from "joi";
import ProductManager from "../manager/productManager.js";
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

let contadorChat = 1;

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
          return socket.emit("error", {
            status: "error",
            errors: validationResult.error.details.map(
              (error) => error.message
            ),
          });
        }
        await pm.addProduct(data);
        const products = await pm.getProducts();
        //enviar los productos al cliente
        socket.emit("products", products);
      } catch (error) {
        socket.emit("error", error);
      }
    });

    // Mensajes del chat

    // socket.on('event', function)

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
    const messages = { mail: "", message: "" };
    socket.on("message", async (msg) => {
      socket.emit("message", msg);
      setTimeout(
        async () =>
          socket.emit(
            "res",
            await mensajePredefinido(contadorChat, msg, messages)
          ),
        1500
      );
    });
  });
};
async function mensajePredefinido(contador, msg, messages) {
  switch (contador) {
    case 1: {
      messages.mail = "";
      messages.message = "";
      contadorChat = 2;
      return "Bienvenido Al ChatBot de tu tienda Online \n Ingrese un mail para poder dar seguimiento a su messages";
    }

    case 2: {
      let estadoValidacion = validarEmail(msg);
      if (!estadoValidacion) {
        return "Ingrese un mail valido";
      }
      messages.mail = msg;
      contadorChat = 3;
    }
    case 3: {
      contadorChat = 4;
      return "Ingrese su consulta ";
    }
    case 4: {
      messages.message = msg;

      try {
        let result = await guardarChat(messages);

        if (!result) {
          return "Su mensaje no pudo ser guardado";
        }
        contadorChat = 1;
        const { mail, message } = messages;
        return `
          Su Correo es: ${mail} \n 
          Su consulta es : ${message} \n
          Gracias, un representante se estará comunicado con usted a la brevedad`;
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        return "Hubo un error al intentar guardar el mensaje";
      }
    }

    default:
      break;
  }
  return;
}

function validarEmail(email) {
  return isEmail(email);
}
async function guardarChat(messages) {
  const result = await Messages.add(messages.mail, messages.message);
  return result;
}

export default IOinit;
