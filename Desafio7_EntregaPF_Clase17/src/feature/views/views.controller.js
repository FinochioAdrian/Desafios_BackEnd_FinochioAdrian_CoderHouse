import Products from "../products/product.dao.js";
import Carts from "../carts/cart.dao.js"
async function home(req, res) {
  try {
    res.render("home", { title: "home" });
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message });
  }
}
async function products(req, res) {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const sort = req.query?.sort || "asc";
    const category = req.query?.category || null;
    const available = req.query?.available || true;

    let result = await Products.getAll(limit, page, sort, category, available);

    result.prevLink = result.hasPrevPage
    ? `../products?page=${result.prevPage}&limit=${result.limit}${category?'&category='+category :''}${sort?'&sort='+sort :''}${!available?'&available='+available :''}`
    : null;
    result.nextLink = result.hasNextPage
    ? `../products?page=${result.prevPage}&limit=${result.limit}${category?'&category='+category :''}${sort?'&sort='+sort :''}${!available?'&available='+available :''}`
    : null;
    
    res.render("products", { title: "Products", result });
  } catch (error) {
    return res.status(error.status || 500).send(`<h1>${error.message} </h1>`);
  }
}
async function product(req, res) {
  try {
    console.log("🚀 ~ product ~ product:")
    
    const {pid} = req.params
    
    if (!pid) {
      res.redirect("/products")
    }
    let product = await Products.getById(pid);

    if(!product){
      res.redirect("/products")
    }
    
    

    res.render("product", { title: "Products", product });
  } catch (error) {
    console.log("🚀 ~ product ~ error:", error)
    
  }
}

async function carts (req, res){

console.log("🚀 ~ carts ~ carts:")

  const { cid } = req.params;
  
  const referer =req.get("referer") || "/products"

  if (!cid) {
    return res.redirect(referer);
  }
  const cartFound = await Carts.getById(cid);
  console.log("🚀 ~ carts ~ cartFound:", cartFound)
  if (!cartFound) {
    return res.redirect(referer);
  }

  res.render("carts",{result:cartFound});
   
  
}
async function addProductInCart (req, res){

console.log("🚀 ~ carts ~ carts:")

  const { cid } = req.params;
  const { pid } = req.params;

  const referer =req.get("referer") || "/products"
  console.log("🚀 ~ addProductInCart ~ referer:", referer)

  if (!cid||!pid) {
    return res.redirect(referer);
  }
  const cartFound = await Carts.getById(cid);
  const product = await Products.getById(pid);

  
  if (!cartFound|!product) {
    return res.redirect(referer);
  }
  
  res.redirect(`carts/${cid}`);
   
  
}

export { home, products, product , carts , addProductInCart};
