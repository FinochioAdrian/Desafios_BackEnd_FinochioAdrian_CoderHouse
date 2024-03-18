import express from "express";
import __dirname from "./utils.js";
import connectDB from "./config/db.config.js";
import handlebars_config from "./config/handlebars.config.js";
import IOconfig from "./config/IO.config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

// service session and login
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

//envió de mensaje entre vistas
import flash from "connect-flash";

//importamos las rutas
import viewsRouter from "./feature/views/views.router.js";
import productsRouter from "./feature/products/products.router.js";
import cartRouter from "./feature/carts/carts.router.js";
import sessionsRouter from "./feature/sessions/sessions.router.js";
import Server from "./server.js";
const app = express();
//const URL ="mongodb://localhost:27017/ecommerce"
const URL = "mongodb+srv://eidrienhez33:K0DW1LhyMOcpSKZy@ecommercecluster.nmjs8p9.mongodb.net/ecommerce?retryWrites=true&w=majority";

connectDB(URL);
//Iniciamos el Server
const PORT = process.env.PORT || 8080;
const httpServer = Server(app, PORT);
// Config Server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Configuración de sesión y almacenamiento en MongoDB
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:URL,
      ttl: 300,
    }),
    secret: "secretCode",
    resave: true,
    saveUninitialized: true,
  })
);
// configuracion y manejo de session por passport local
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

 // Mensajes Flash
app.use(flash());
// Manejo de Handlebars
handlebars_config(app);
app.use(express.static(__dirname + "/public"));

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter );

//manejo de Socket y chat
IOconfig(httpServer);

export default app;
