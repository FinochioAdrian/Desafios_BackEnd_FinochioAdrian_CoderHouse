import Products from "../products/product.dao.js";
import Carts from "./cart.dao.js";

async function getAll(req, res) {
  try {
    let { limit, skip } = req.query;
    // /?limit=1
    // Check the existence of the query.limit
    if (limit && !skip) {
      // Apply limit to the list of carts
      let limitedCarts = await Carts.getAllWithLimit(limit);
      return res.send({ carts: limitedCarts });
    }

    // /?skip=1
    // Check the existence of the query.skip
    if (skip && !limit) {
      // Apply starting point to the list of carts
      let limitedCarts = await Carts.getAllWithLimit(skip);
      return res.send({ carts: limitedCarts });
    }

    // /?limit=1&skip=1
    // Check the existence of the query.skip && query.limit
    if (limit && skip) {
      let limitedCarts = await Carts.getAllWithLimit(limit, skip);
      return res.send({ carts: limitedCarts });
    }

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

async function create(req, res) {
  try {
    const { body } = req;
    console.log("🚀 ~ create ~ body:", body);
    console.log("body".body);
    const payload = await Carts.add({ ...body });
    res.status(201).send({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", error: "Error guardando el producto." });
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
    console.log("🚀 ~ removeProductInCart ~ result:", result)
    
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
export { getAll, get, create, addProductInCart ,removeProductInCart ,removeCart};
