import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
//importamos las rutas
import viewsRouter from "./routers/views.router.js";
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);



const httpServer = app.listen("8080", () => {
  console.log("Server run in port: 8080 => http://localhost:8080/");
});

// Manejo de Handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", 'handlebars');
app.use(express.static(__dirname + "/public"));
app.use('/',viewsRouter)

//manejo de Socket