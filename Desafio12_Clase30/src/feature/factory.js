import MongoSingleton from "../config/mongoSingleton.js";
import config from "../config/config.js";

export let Products;
switch (config.PERSISTENCE) {
  case "MONGO":
    const connection = MongoSingleton.getInstance();
    
    const { default: ProductsMongo } = await import(
      "./products/products.dao.js"
    );

    
    Products = ProductsMongo

    break;
  case "MEMORY":
    
    break;
  case "FILE":
    
    break;
}
