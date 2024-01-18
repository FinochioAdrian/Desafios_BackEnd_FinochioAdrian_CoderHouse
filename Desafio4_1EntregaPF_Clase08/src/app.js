
import express from "express";
import productsRouter from './routers/products.router.js'
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/products',productsRouter)

app.get("/", (req, res) => {
  res.send('Hello World! , visite <a href="http://localhost:8080/products">http://localhost:8080/products</a> ');
});


app.listen("8080", () => {
  console.log("Server run in port: 8080 => http://localhost:8080/");
});
