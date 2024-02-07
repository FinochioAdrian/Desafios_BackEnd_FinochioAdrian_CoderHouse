import Cart from "./models/cart.model";

class CartDao {
  static async getAll() {
    return Cart.find().lean();
  }
  static async getById(id) {
    return Cart.find({ _id: id }).lean();
  }
  static async add(product) {
    return new Cart(product);
  }
  static async addNewProductInCartById(cartId, productID) {
    try {
      const result = await Cart.findOneAndUpdate(
        { _id: cartId, "products._id": productID },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      ).lean();

      if (!result) {
        // Si no se encontró un carrito con el producto, puedes agregar el producto al carrito aquí
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
  static async update(id, data) {
    return Cart.findOneAndUpdate({ _id: id }, data).lean()  ;
  }
  static async remove(id){
    return Cart.findByIdAndDelete(id);
  }
}
