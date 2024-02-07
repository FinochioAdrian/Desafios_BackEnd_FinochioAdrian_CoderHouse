import Chat from './chat.model'

class ChatDao {
  static async getAll() {
    return Chat.find().lean();
  }
  static async getById(id) {
    return Chat.find({ _id: id }).lean();
  }
  static async getByUser(userMail) {
    return Chat.find({ user: userMail }).lean();
  }
  static async add(userMail,message) {
    return new Chat({user:userMail,message});
  }

  static async addNewProductInCartById(userMail, message) {
    try {
      const result = await Chat.findOneAndUpdate(
        { user:userMail},
        { $set: { "message": "message"+" /n " +message } },
        { new: true }
      ).lean();

      if (!result) {
        // Si no se encontró un carrito con el producto, puedes agregar el producto al carrito aquí
        const addChat = await this.add(userMail,message)
        return addChat;
      }

      return result;
    } catch (error) {
      console.error(
        "Error al agregar o actualizar el message en el chat:",
        error
      );
      throw error; 
    }
  }
  static async update(id, message) {
    return Chat.findOneAndUpdate({ _id: id }, message);
  }
  static async remove(id){
    return Chat.findByIdAndDelete(id);
  }
  static async removeByUser(userMail){
    return Chat.findAndDelete({user:userMail});
  }
}
