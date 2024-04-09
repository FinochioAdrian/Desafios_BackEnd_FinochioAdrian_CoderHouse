import Users from "./users.model.js";
import CartDao from "../carts/cart.dao.js"

const cartDao = new CartDao ()
// UsersDAO class
export default class UsersDAO {
  constructor(){}
  // get user by email
  async getUserByEmail(email) {
    try {
      // find user by email
      return await Users.findOne({ email }).lean();
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ getUserByEmail ~ error:", error);
      throw error;
    }
  }

  // get user by credentials
  async getUserByCreds(email, password) {
    try {
      // find user by email and password
      return await Users.findOne({ email, password }).lean();
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ getUserByCreds ~ error:", error);
      throw error;
    }
  }

  // insert new user
  async insert(userData) {
    try {
      const cart = await cartDao.createCartEmpty()
      userData.cart=cart._id
      // save new user to database
      const newuser= await new Users(userData).save();
      if (newuser) {
        await cart.save()
        return newuser
       
      }
      return newuser
    } catch (error) {
      console.log("❌ ~ UsersDAO ~ insert ~ error:", error);
      throw error;
    }
  }

  // get user by id
  async getUserByID(id) {
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

  async newPassword(user) {
    try {
        return await Users.findOneAndUpdate({email:user.email},{password:user.password}).lean()
    } catch (error) {
      console.log("❌ ~ newPassword ~ error:", error);
      throw error;
    }
  }
  
}

