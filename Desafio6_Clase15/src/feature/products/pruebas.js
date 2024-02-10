import Products from "./product.model.js";
import connectDB from '../../config/db.config.js'
async function enviromentPrueba (){

    connectDB()

    Products.deleteMany({code:"D4E5F7"})
}

enviromentPrueba()