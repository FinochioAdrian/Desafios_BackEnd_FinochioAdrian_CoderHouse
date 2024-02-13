import { Server } from "socket.io";
import validator from 'validator'
const {isEmail} = validator
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
  const consulta = {mail:"",chat:""} ;
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

    // Mensajes del chat
   

      
  
      // socket.on('event', function)
  
      socket.on("disconnect", () => {
          console.log("A user disconnected");
      })
  
      
      socket.on("message", (msg) => {
          socket.emit("message", msg);
          setTimeout(()=>socket.emit("res",mensajePredefinido(contadorChat,msg) ),1500)
          
      })
  
 
  });

  }
function mensajePredefinido(contador,msg){

  switch (contador) {
    case 1: {
      contadorChat=2
      return "Bienvenido Al ChatBot de tu tienda Online" }
      
      
    case 2: {
      contadorChat=3
      return "Ingrese un mail para poder dar seguimiento a su consulta" }
      
      
    case 3: {
        let estadoValidacion=validarEmail(msg)
        if(!estadoValidacion){
          return "Ingrese un mail valido"
        }
        consulta.mail=msg
        contadorChat=4
        
        mensajePredefinido(contadorChat)
      }
      case 4: {
        contadorChat=5
          return "Ingrese Su consulta "
      
      }
      case 5: {
        consulta.chat=msg
        //TODO Guardar chat en Chat.create
        guardarChat(consulta)
        contadorChat=1
          return "Gracias, un representante se estará comunicado con usted a la brevedad"
      
      }
      
    
  
    default:
      break;
  } 
  return  
}

  function validarEmail(email){
    return isEmail(email);
  }
  function guardarChat (chat) {

    

  }
  
  export default IOinit