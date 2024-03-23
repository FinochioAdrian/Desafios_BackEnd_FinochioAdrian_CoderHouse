import express from "express";
import __dirname from "./utils.js";
import connectDB from "./config/db.config.js";
import handlebars_config from "./config/handlebars.config.js";
import IOconfig from "./config/IO.config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import session from "express-session";
// service session and login
import cookieParser from "cookie-parser";

//envió de mensaje entre vistas
import flash from "connect-flash";

//importamos las rutas
import viewsRouter from "./feature/views/views.router.js";
import productsRouter from "./feature/products/products.router.js";
import cartRouter from "./feature/carts/carts.router.js";
import sessionsRouter from "./feature/sessions/sessions.router.js";
import Server from "./server.js";
const app = express();
//enviroment var
const PRIVATE_KEY_COOKIE = "EidrienKeyCookieSecret";
const PORT = process.env.PORT||8080;
const URL_LOCAL_MONGOOSE = "mongodb://localhost:27017/loginClase20"

const URL_ONLINE_MONGOOSE = "mongodb+srv://eidrienhez33:K0DW1LhyMOcpSKZy@ecommercecluster.nmjs8p9.mongodb.net/ecommerce?retryWrites=true&w=majority";

connectDB(URL_ONLINE_MONGOOSE);

//Iniciamos el Server

const httpServer = Server(app, PORT);
// Config Server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(PRIVATE_KEY_COOKIE));
// Configuración de sesión y almacenamiento en MongoDB

app.use(session({
    cookie: {maxAge:60000},
    secret:PRIVATE_KEY_COOKIE,
    resave:false,
    saveUninitialized:false
}))

// configuracion y manejo de session por passport local
initializePassport()
app.use(passport.initialize())


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
