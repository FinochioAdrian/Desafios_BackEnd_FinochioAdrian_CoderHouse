import connectDB from './config/db.config.js'
import ProductsDao from './feature/products/product.dao.js';
import ProductManager from './manager/productManager.js';
import CartManager from './manager/cartManager.js';
import CartDao from './feature/carts/cart.dao.js';
async function enviromentPrueba (){

    await connectDB()

    /* await cargarCarritoAtlas() */
    await cargarProductosAtlas()
   

    
}


 const cargarCarritoAtlas = async ()=> {
  
  const cm = new CartManager()
  const cartJSON = await cm.getCarts()
  await asyncForEach(cartJSON, async (item) => {
    
    await guardarCartEnAtlas(item);
  });

}
 const cargarProductosAtlas = async ()=> {
  const pm = new ProductManager()
  const productsJSON = await pm.getProducts()
  await asyncForEach(productsJSON, async (item) => {
    
    await guardarProductosEnAtlas(item);
  });

}

const guardarCartEnAtlas = async({products}) => {
  try {
    
    let result = await CartDao.add(products)
    
  } catch (error) {
    console.log(" ❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}
const guardarProductosEnAtlas = async({title,description,price,thumbnails,code,stock,status,category='IT'}) => {
  try {
    let result = await ProductsDao.add({title,description,code,price,stock,status,category,thumbnails})
    
  } catch (error) {
    console.log(" ❌ ~ guardarEnAtlas ~ error:", error)
    
  }
  
}

enviromentPrueba()


async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}



