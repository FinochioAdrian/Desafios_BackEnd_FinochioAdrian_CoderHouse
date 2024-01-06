import fs from "fs";



class ProductManager {
  #id = 0;

  constructor() {
    this.products = [];
    this.path = "./productos.json";
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if ([title, description, price, thumbnail, code, stock].some((field) => !field)) {
      throw new Error("Todos los campos son obligatorios addProduct(title, description, price, thumbnail, code, stock)");
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
    await this.writeFile(this.products);

    this.#id++;
  }

  async getProducts() {
    return this.readFile();
  }

  async getProductById(id) {
    const products = await this.readFile();
    const foundProduct = products.find((pro) => pro.id === id);

    if (!foundProduct) {
      throw new Error(`El producto con el Id: ${id} no se encontró`);
    }

    return foundProduct;
  }

  async fileExist() {
    try {
      await fs.promises.access(this.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readFile() {
    const exist = await this.fileExist();
    if (!exist) return [];

    const productsJson = await fs.promises.readFile(this.path);
    return JSON.parse(productsJson);
  }

  async deleteProductByID(id) {
    const products = await this.getProducts();

    if (!products.some((prod) => prod.id === id)) {
      throw new Error(`El producto con el id ${id} no existe`);
    }

    const filteredProducts = products.filter((pro) => pro.id !== id);
    await this.writeFile(filteredProducts);
  }

  async updateProductFields(id, updatedFields) {
    const products = await this.readFile();
    const index = products.findIndex((pro) => pro.id === id);

    if (index === -1) {
      throw new Error(`El producto con el Id: ${id} no se encontró`);
    }

    const updatedProduct = { ...products[index], ...updatedFields };
    products[index] = updatedProduct;

    await this.writeFile(products);
  }

  async updateProduct({ id, ...product }) {
    await this.updateProductFields(id, product);
  }

  async writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data));
  }
  async addProductDemo(){
    const productoPrueba = {
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25,
    };
    const { title, description, price, thumbnail, code, stock } = productoPrueba;
    await this.addProduct(title, description, price, thumbnail, code, stock);
  
  }
}



export default ProductManager