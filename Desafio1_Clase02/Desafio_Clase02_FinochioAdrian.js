class ProductManager {
  #id = 0;
  constructor() {
    this.products = [];
  }
  addProduct( title, description, price, thumbnail, code, stock ) {
    
    

    if ([title, description, price, thumbnail, code, stock].some(field => !field)) {
        throw new Error("Todos los campos son obligatorios")
    }

    if (this.products.some((prod) => prod.code === code)) {
        throw new Error(`El Producto ${title} existente con Id: ${code}` );
      
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
    this.#id++;
  }

  getProducts() {
    return this.products;
  }
  getProductById(id) {
    const foundProduct = this.products.find((pro) => pro.id === id);
   
    return foundProduct ?? (()=>{ throw new Error("Not Found"); })();
  }
}

const productoPrueba = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

const {title,description,price,thumbnail,code,stock} = productoPrueba
// Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();
try {
    // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    console.log(pm.getProducts());
    // Se llamará al método “addProduct” con los campos:
    pm.addProduct(title,description,price,thumbnail,code,stock); //-> El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
    // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
    console.log(pm.getProducts());
    // Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
    pm.addProduct(title,description,price,thumbnail,code,stock);
    // Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
    console.log(pm.getProductById(2));
}catch(e){
    console.log(e);
}










