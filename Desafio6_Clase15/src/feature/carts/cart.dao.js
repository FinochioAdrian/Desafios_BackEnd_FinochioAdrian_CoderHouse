import Cart from "./cart.model.js";

class CartDao {
  static async getAll() {
    return Cart.find().lean();
  }
  static async getById(id) {
    return Cart.findOne({ _id: id }).lean();
  }
  static async add(products) {
    const newCart = new Cart(products);
    await newCart.save();
    return newCart;
  }
  static async addNewProductInCartById(cartId, productID) {
    try {
      const resultOne = await Cart.findOne({ _id: cartId })

      const result = await Cart.findOneAndUpdate(
        { _id: cartId, "products._id": productID },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      ).lean();
      

      if (!result) {
        // Si no se encontró un carrito con el producto, agregar el producto al carrito aquí
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { $push: { products: { _id: productID, quantity: 1 } } },
          { new: true }
        );
        return updatedCart;
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
  static async removeProductInCartById(cartId, productID) {
    try {
     

      const result = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products:{_id:productID} } },
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
