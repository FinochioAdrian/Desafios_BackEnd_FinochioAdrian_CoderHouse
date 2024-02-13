import Products from "../products/product.dao.js";



async function home(req, res) {
  try {
   
    let products = await Products.getAll();
    
    res.render("home",{title:"home", products});

  } catch (error) {
    
    return res.status(error.status || 500).send({ error: error.message });
  }
}

export { home }
