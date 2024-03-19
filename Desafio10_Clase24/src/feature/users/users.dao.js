import Users from "./users.model.js";
import CartDao from "../carts/cart.dao.js"
// UsersDAO class
class UsersDAO {
  // get user by email
  static async getUserByEmail(email) {
    try {
      // find user by email
      return await Users.findOne({ email }).lean();
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ getUserByEmail ~ error:", error);
      throw error;
    }
  }

  // get user by credentials
  static async getUserByCreds(email, password) {
    try {
      // find user by email and password
      return await Users.findOne({ email, password }).lean();
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ getUserByCreds ~ error:", error);
      throw error;
    }
  }

  // insert new user
  static async insert(userData) {
    try {
      console.log("🚀 ~ UsersDAO ~ insert ~ userData:", userData)
      const cart = await CartDao.createCartEmpty()
      console.log("🚀 ~ UsersDAO ~ insert ~ cart:", cart)
      userData.cart=cart._id
      console.log("🚀 ~ UsersDAO ~ insert ~ userData:", userData)
      // save new user to database
      const newuser= await new Users(userData).save();
      if (newuser) {
        await cart.save()
       
      }
      return newuser
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ insert ~ error:", error);
      throw error;
    }
  }

  // get user by id
  static async getUserByID(id) {
    try {
      // find user by id and select specific fields
      return await Users.findOne(
        { _id: id },
        { first_name: 1, last_name: 1, age: 1, email: 1, role: 1 }
      ).lean();
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ getUserByID ~ error:", error);
      throw error;
    }
  }

  static async newPassword(user) {
    try {
        return await Users.findOneAndUpdate({email:user.email},{password:user.password}).lean()
    } catch (error) {
      console.log("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }
  
}

export default UsersDAO;
