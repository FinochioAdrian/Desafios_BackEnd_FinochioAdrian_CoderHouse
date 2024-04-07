import { Products } from "../../factory.js";
import ProductRepository from "./product.repository.js";

export const productsService = new ProductRepository( new Products())
