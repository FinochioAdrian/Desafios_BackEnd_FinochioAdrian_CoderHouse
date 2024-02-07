import express from "express";
import __dirname from "./utils/utils.js";
import mongoose from 'mongoose'


//importamos las rutas
import viewsRouter from "./feature/views/views.router.js";
import productsRouter from "./feature/products/products.router.js";
import cartRouter from "./feature/carts/carts.router.js";
import handlebars_config from "./utils/handlebars_config.js";
import IOconfig from "./utils/IOconfig.js";

mongoose.connect("mongodb://localhost:27017/ecommerce")

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
