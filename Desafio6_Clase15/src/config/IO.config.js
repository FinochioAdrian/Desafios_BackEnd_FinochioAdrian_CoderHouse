import { Server } from "socket.io";
import Messages from "../feature/messages/messages.dao.js";
import validator from "validator";
const { isEmail, isEmpty } = validator;
import Joi from "joi";
import ProductManager from "../manager/productManager.js";
import ProductDao from "../feature/products/product.dao.js";
import __dirname from "../utils.js";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import sharp from "sharp";
const productAddSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()),
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().strict(true).required(),
  status: Joi.boolean().default(true),
  stock: Joi.number().integer().strict(true).required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.binary()),
});

let contadorChat = 1;

const IOinit = (httpServer) => {
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("Nuevo Cliente conectado");

    socket.on("getProducts", async (data) => {
      try {
        const products = await ProductDao.getAll();
        //enviar los productos al cliente
        socket.emit("products", products);
      } catch (error) {
        console.log("❌ ~ socket.on ~ error:", error);
      }
    });

    socket.on("addNewProduct", async (data) => {
      console.log("🚀 ~ socket.on ~ data:", data);
      try {
        // Validar el cuerpo de la solicitud contra el esquema
        const validationResult = productAddSchema.validate(data, {
          abortEarly: false,
        });

        if (validationResult.error) {
          console.log(
            "❌ ~ socket.on ~ validationResult.error:",
            validationResult.error
          );
          const errors = validationResult.error.details.map(
            (error) => error.message
          );
          // Si hay errores de validación, enviar una respuesta con los errores
          return socket.emit("error", {
            status: "error",
            errors,
          });
        }

        try {
          // Guardando de imágenes en el servidor
          const savedImages = await SaveImages(data.thumbnails);

          

          data.thumbnails = savedImages;
        } catch (error) {
          console.error("Error al subir imágenes:", error);
          // Manejar el error según sea necesario
          throw error;
        }

        await ProductDao.add({ ...data });
        const products = await ProductDao.getAll();
        //enviar los productos al cliente
        socket.emit("products", products);
      } catch (error) {
        console.log("❌ ~ socket.on ~ error:", error);
        socket.emit({ status: "error", error: error.message });
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

async function SaveImages(data) {
  try {
    // Aquí puedes procesar y guardar las imágenes en el servidor

    const fileNames = await Promise.all(
      data.map(async (image, index) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const fileName = `${uniqueSuffix}.webp`;
        const directoryPath = path.join(__dirname, "/public/images/products/");
        const filePath = path.join(directoryPath, fileName);

        await mkdir(directoryPath, { recursive: true });
        const convertedImageBuffer = await sharp(image)
          .toFormat("webp")
          .toBuffer();

        await writeFile(filePath, convertedImageBuffer);
        return fileName;
      })
    );
    fileNames.forEach((fileName) => {
      console.log("Imagen guardada:", fileName);
    });
    // Devolver nombres de archivo al cliente
    return fileNames;
  } catch (error) {
    console.log(
      "❌ ~ SaveImages ~ error:",
      "Error al procesar imágenes:",
      error
    );
  }
}

export default IOinit;
