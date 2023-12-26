const fs = require("fs");

class ProductManager {
  #id = 0;
  constructor() {
    this.products = [];
    this.path = "./productos.json";
  }
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    if (
      [title, description, price, thumbnail, code, stock].some(
        (field) => !field
      )
    ) {
      throw new Error(
        `Todos los campos son obligatorios addProduct(title, description, price, thumbnail, code, stock)`
      );
    }

    if (this.products.some((prod) => prod.code === code)) {
      throw new Error(`El Producto ${title} existente con Id: ${code}`);
    }

    let product = {
      id: this.#id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));

    this.#id++;
  };

  getProducts = async () => {
    return this.readProduct();
  };

  getProductById = async (id) => {
    const products = await this.readProduct();
    const foundProduct = products.find((pro) => pro.id === id);

    return (
      foundProduct ??
      (() => {
        console.error(`El producto con el Id: ${id} no se encontró`);
      })()
    );
  };

  fileExist = async () => {
    try {
      await fs.promises.access(this.path);

      return true;
    } catch (error) {
      return false;
    }
  };
  readProduct = async () => {
    const exist = await this.fileExist();
    if (!exist) return [];

    const productsJson = await fs.promises.readFile(this.path);
    return JSON.parse(productsJson);
  };

  deleteProductByID = async (id) => {
    const res = await this.getProducts();
    if (!res.some(prod => prod.id === id))
    return console.error(`El producto con el id ${id} no existe`);
    const prodFilter = res.filter((pro) => pro.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(prodFilter));
  };

  updateProduct = async ({ id, ...product }) => {
    await this.deleteProductByID(id);
    const prodOld = await this.readProduct();
    const productsModif = [{ id, ...product }, ...prodOld];
    await fs.promises.writeFile(this.path, JSON.stringify(productsModif));
  };
}

const productoPrueba = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

const { title, description, price, thumbnail, code, stock } = productoPrueba;
// Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();
(async () => {
  try {
    console.log(
      "Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []"
    );
    pm.getProducts().then((res) => console.log(res));
    console.log("Se llamará al método “addProduct” con los campos:");
    await pm.addProduct(title, description, price, thumbnail, code, stock);
    await pm.addProduct(title, description, price, thumbnail, "abc123B", stock);
    await pm.addProduct(title, description, price, thumbnail, "def123a", stock); //-> El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
    console.log(
      "Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado"
    );
    await pm.getProducts().then((res) => console.log(res));
    console.log(
      "Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error"
    );
    await pm.getProductById(1).then((res) => console.log(res));
    await pm.getProductById(4).then((res) => console.log(res));
    console.log(
      "Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización."
    );
    await pm.updateProduct({
      id: 1,
      title,
      description,
      price: 2000,
      thumbnail,
      code: "abc123B",
      stock,
    });
    await pm.getProducts().then((res) => console.log(res));
    console.log(
      "Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir"
    );

    await pm.deleteProductByID(2)
    await pm.getProducts().then((res) => console.log(res));
    await pm.deleteProductByID(5)
    
  } catch (e) {
    console.log(e);
  }
})();
