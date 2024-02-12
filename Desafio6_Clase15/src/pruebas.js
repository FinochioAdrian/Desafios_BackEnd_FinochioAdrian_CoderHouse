import Carts from "./feature/carts/cart.model.js";
import connectDB from './config/db.config.js'
import mongoose from "mongoose";
async function enviromentPrueba (){

    connectDB()
    
    const newCartId =new mongoose.Types.ObjectId().toString();;
    const cartId = "65c3e353bdb5337609395e85" ;
    const productId ="65c3e353bdb5337609395e98";

    const result = await Carts.findOneAndUpdate(
        { _id: cartId },
        { $addToSet: { carts: { _id: productId, quantity: 1 } } },
        { upsert: true, new: true }
      );
    console.log(result);
}

enviromentPrueba()