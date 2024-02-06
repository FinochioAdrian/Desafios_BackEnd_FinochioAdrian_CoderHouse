import express from "express";
import __dirname from "./utils.js";
import mongoose from 'moongose'


//importamos las rutas
import viewsRouter from "./routers/views.router.js";
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import handlebars_config from "./handlebars_config.js";
import IOconfig from "./IOconfig.js";

mongoose.connect("mongodb://localhost:2707/ecommerce")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const httpServer = app.listen("8080", () => {
  console.log("Server run in port: 8080 => http://localhost:8080/");
});

// Manejo de Handlebars
handlebars_config(app);
app.use(express.static(__dirname + "/public"));


//manejo de Socket
IOconfig(httpServer)
