import express from "express";
import __dirname from "./utils.js";
import connectDB from "./config/db.config.js";
import handlebars_config from "./config/handlebars.config.js";
import IOconfig from "./config/IO.config.js";
// service session and login
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
//envio de mensaje entre vistas
import flash from 'connect-flash'

//importamos las rutas
import viewsRouter from "./feature/views/views.router.js";
import productsRouter from "./feature/products/products.router.js";
import cartRouter from "./feature/carts/carts.router.js";
import Server from "./server.js";
const app = express();

connectDB()
//Iniciamos el Server
const PORT = process.env.PORT
const httpServer =Server(app,PORT)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    store:MongoStore.create({
        mongoUrl,
        ttl:300
    }),
    secret:"secretCode",
    resave:true,
    saveUninitialized:true
}))
app.use(flash())
// Manejo de Handlebars
handlebars_config(app);
app.use(express.static(__dirname + "/public"));


// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);






//manejo de Socket
IOconfig(httpServer)


export default app;