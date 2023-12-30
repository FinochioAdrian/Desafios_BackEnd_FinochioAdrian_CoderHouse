import ProductManager from "./productManager.js";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
const pm = new ProductManager();

app.get("/", (req, res) => {
  res.send("Hello World! , visite <a>http://localhost:8080/products</a> ");
});

app.get("/products", async (req, res) => {
  try {
    const products = await pm.getProducts();
    //Comprobamos la existencia del query.limit
    if (req.query && req.query.limit) {
      let { limit } = req.query;
      limit = parseInt(limit, 10);
      //verificar si es un numero valido
      if (!isNaN(limit) && limit > 0) {
        //aplicar limite a la lista de productos
        let limitedProducts = products.slice(0, limit);
        return res.send({ products: limitedProducts });
      } else {
        return res.status(400).send({
          error: 'El parámetro "limit" debe ser un número entero positivo.',
        });
      }
    }
    res.send({ products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al obtener productos." });
  }
});
app.get("/products/:pid", async (req, res) => {
  try {
    /* const products = await pm.getProductById(req); */
    //Comprobamos la existencia del query.limit
    if (req.params && req.params.pid) {
      let { pid } = req.params;
      pid = parseInt(pid, 10);
      if (!isNaN(pid) && pid >= 0) {
        try {
          let productFound = await pm.getProductById(pid);

          // Producto encontrado, enviarlo en la respuesta
          return res.send({ productFound });
        } catch (error) {
          // Manejar el error específico cuando el producto no se encuentra
          return res.status(404).send({
            error: `El producto con el id ${pid} no se encuentra.`,
          });
        }
      } else {
        return res.status(400).send({
          error: "El parámetro debe ser un número entero positivo.",
        });
      }
    } else {
      return res.status(400).send({
        error: "Se requiere el parámetro id de búsqueda en la URL.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al obtener productos." });
  }
});
app.listen("8080", () => {
  console.log("Server run in port: 8080 => http://localhost:8080/");
});
