import { generateListProducts } from "../../utils/Mocks.js";
import CustomError from "../../utils/errors/customError.js";
import EErrors from "../../utils/errors/enums.js";
import { customCauseErrorInfo } from "../../utils/errors/info.js";
import {productsService as Products} from "./repository/index.js";

async function getAll(req, res,next) {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const sort = req.query?.sort || "asc";
    const category = req.query?.category || null;
    const available = req.query?.available || true;

    let result = await Products.getAll(limit, page, sort, category, available);
    const payload = result.docs;
    delete result.docs;
    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/home?page=${result.prevPage}`
      : null;
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/home?page=${result.nextPage}`
      : null;

    res.send({ status: "sucess", payload, ...result });
  } catch (error) {
    next(error)
  }
}
async function getAllMockingProducts(req, res,next) {
  try {
    const result = await generateListProducts()

    
    res.send({ status: "sucess", payload: [...result] } );
  } catch (error) {
    next(error)
  }
}

async function get(req, res,next) {
  try {
    let { pid } = req.params;

    let productFound = await Products.getById(pid);
    if (!productFound) {

      const msg =`Product with ID ${pid} not found.`
      throw new CustomError({name:"PRODUCT_NOT_FOUND",cause:customCauseErrorInfo(msg),message:"Error getting product by id",code:EErrors.DATABASE_EXCEPTION,status:404})
     
    }
    // Product found, send it in the response
    return res.send({ product: productFound });
  } catch (error) {
    next(error)
  }
}

async function create(req, res,next) {
  // Validate the request body against the schema
  const { body:product } = req;
  const {user} = req
  console.log("🚀 ~ create ~ user:", user)
  console.log("🚀 ~ create ~ product:", product)
  product.owner={
    _id:user._id,
    admin:false
  }
 
  
  if (user.role=="admin"){
    product.owner.admin=true
    console.log("🚀 ~ create ~ user.role=='admin':", user.role=="admin")
    
    console.log("🚀 ~ create ~ product:", product)
  }
  
  console.log("🚀 ~ create ~ product:", product)
   try {
    const result = await Products.getWithCode(product.code);
    

    if (result?.length > 0) {
      const msg =`The 'code': ${product.code} $ field already exists in the database.`
      throw new CustomError({name:"Error_Create",cause:customCauseErrorInfo(msg),message:"Error Created product",code:EErrors.DATABASE_EXCEPTION,status:409})
      
    }

    if (req.files) {
      const filePath = req.files;
      const thumbnails = filePath.map((value) => {
        return value.path.replace(/\\/g, "/");
      });
      product.thumbnails = thumbnails;
    }

    const payload = await Products.add({ ...product });

    res.status(201).send({ status: "success", payload });
  } catch (error) {
    next(error)
  } 
}

async function update(req, res,next) {
  try {
    let { pid } = req.params;
    const product = req.body;

    let result = await Products.getWithCode(product.code);
    result = JSON.parse(JSON.stringify(result));
    
    if (result?.length > 0 && result._id !== pid) {
      return res.status(409).send({
        status: "fail",
        msg: `The 'code': ${product.code}, field already exists in the database.`,
      });
    }

    // Update products

    let productUpdate = await Products.update(pid, product);
    // Response Product not found
    if (!productUpdate) {
      return res
        .status(404)
        .send({ status: "fail", msg: `No product found with ID ${pid}` });
    }
    // Response Product found, send to response
    return res.send({ status: 200, payload: productUpdate });
  } catch (error) {
    
    next(error)
  }
}

async function remove(req, res,next) {
  try {
    let { pid } = req.params;

    // Delete product
    const productRemove = await Products.remove(pid);

    // Product found, send it in the response
    return res.status(201).send({
      status: "success",
      msg: `Product with ID ${pid} has been deleted `,
    });
  } catch (error) {
    next(error)
  }
}

export { getAll, get, create, update, remove, getAllMockingProducts };
