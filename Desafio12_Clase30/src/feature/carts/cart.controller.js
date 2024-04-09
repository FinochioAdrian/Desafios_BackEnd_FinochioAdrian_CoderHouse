import {productsService as Products} from "../products/repository/index.js";
import {cartsService as Carts} from './repository/index.js'
async function getAll(req, res) {
  try {


    const cartFound = await Carts.getAll();
    res.send(cartFound);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      status: "error",
      error: "Error obteniendo el carrito.",
      msg: error.message,
    });
  }
}
async function get(req, res) {
  try {
    const { cid } = req.params;

    const cartFound = await Carts.getById(cid);
    if (!cartFound) {
      return res
        .status(404)
        .send({ status: "fail", msg: `Cart with ID ${cid} not found.` });
    }

    res.send({status:"success",payload:cartFound});
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      status: "error",
      error: "Error obteniendo el carrito.",
      msg: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { body } = req;
    
   
    const payload =  await Carts.add(body.products ); 
    res.status(201).send({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res
      .status(error.status||500)
      .send({ status: "error", error: error.message });
  }
}

async function addProductInCart(req, res) {
  try {
    const { cid, pid } = req.params;

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    const result = await Carts.addNewProductInCartById(cart._id, product._id);
    if (!result){
      return res.status(400).send({ status: "fail", msg: "Product no insert in cart" });
    }
    return res.status(201).send({ status: "success" ,payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
async function updateQuantityProductInCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity) ) {
      return res.status(404).send({ status: "fail", msg: "Quantity product number in body is required" });
    }

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    const result =  await Carts.updateOneProductInCart(cart._id, product._id,quantity); 
   
    return res.status(201).send({ status: "success" ,payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}

// update all products in cart by id param and products array in body,
async function updateProductsInCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const { products } = req.body;

    const cart = await Carts.getById(cid);

    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!products) {
      return res.status(404).send({ status: "fail", msg: "Products no found" });
    }

    const result = await Carts.updateAllProductsInCart(cart._id, products);

    
    return res.status(201).send({ status: "success" ,payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
async function removeProductInCart(req, res) {
  try {
    const { cid, pid } = req.params;

    const cart = await Carts.getById(cid);
    if (!cart) {
      return res.status(404).send({ status: "fail", msg: "Cart no found" });
    }
    const product = await Products.getById(pid);

    if (!product) {
      return res.status(404).send({ status: "fail", msg: "Product no found" });
    }

    const result = await Carts.removeProductInCartById(cart._id, product._id);
    
    if (!result){
      return res.status(400).send({ status: "fail", msg: `No element with _id ${product._id} found in cart`  });
    }
    return res.status(201).send({ status: "success" ,payload: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}

async function removeCart(req,res){
  try {
    const {cid} = req.params;
    const removeResult = await Carts.remove(cid)
    if (!removeResult){
      return res.status(400).send({status:"fail", msg:`Cart with id ${cid} not removed`})
    }
    return res.send({status:"success", msg:`Cart with id ${cid} was removed`})
 
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .send({ status: "error", error: error.message });
  }
}
export { getAll, get, create, addProductInCart, updateProductsInCart, updateQuantityProductInCart ,removeProductInCart ,removeCart};
