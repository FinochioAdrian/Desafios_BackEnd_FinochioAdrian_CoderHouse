import ProductsDao from "../products/product.dao.js";
import Cart from "./cart.model.js";

class CartDao {
  static async getAll() {
    return Cart.find().lean();
  }
  static async getById(id) {
    return Cart.findOne({ _id: id }).populate("products.product").lean();
  }
  static async add(products) {
    const uniqueProductIds = new Set(
      products.map((product) => product.product)
    );

    if (uniqueProductIds.size !== products.length) {
      // Duplicados encontrados, manejar el error
      const error = new Error("Duplicates found in the products array");
      error.status = 422;
      throw error;
    }
    const productsFind = await ProductsDao.getByIdInMatriz(
      Array.from(uniqueProductIds)
    );
    if (uniqueProductIds.size !== productsFind.length) {
      const error = new Error(`Product ID(s) in the query body do not exist`);
      error.status = 422;
      throw error;
    }

    const newCart = new Cart({ products });
    await newCart.save();
    return newCart;
  }
  static async addNewProductInCartById(cartId, productID, quantity = 1) {
    try {
      const result = await Cart.findOne({
        _id: cartId,
        "products.product": productID,
      });

      if (!result) {
        // Si no se encontró un carrito con el producto, agregar el producto al carrito aquí
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { $push: { products: { product: productID, quantity } } },
          { new: true }
        );
        return updatedCart;
      } else {
        const updatedCart = await this.updateOneProductInCart(
          cartId,
          productID,
          quantity
        );
      }

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  }
  static async updateOneProductInCart(cartId, productID, quantity) {
    try {
      const result = await Cart.findOneAndUpdate(
        { _id: cartId, "products.product": productID },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  }
  static async updateAllProductsInCart(cartId, products) {
    try {
      const uniqueProductIds = new Set(products.map((product) => product._id));

      if (uniqueProductIds.size !== products.length) {
        // Duplicados encontrados, manejar el error
        throw new Error("Duplicados encontrados en la matriz de productos");
      }

      const result = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $set: { products: products } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  }
  static async removeProductInCartById(cartId, productID) {
    try {
      const result = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productID } } },
        { new: true }
      ).lean();

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar producto en el carrito:",
        error
      );
      throw error;
    }
  }
  static async update(id, data) {
    return Cart.findOneAndUpdate({ _id: id }, data).lean();
  }
  static async remove(id) {
    return Cart.findByIdAndDelete(id);
  }
  static async getAllWithLimit(limit, skip = 0) {
    try {
      return Cart.find().skip(skip).limit(limit).lean();
    } catch (error) {
      console.log("Error get all carts with limit " + error);
      throw new Error("Error get all carts with limit");
    }
  }
}
export default CartDao;
