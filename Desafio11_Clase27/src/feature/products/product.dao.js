import Products from "./product.model.js";

class ProductsDao {
  static async getAll(limit, page, sort, category, available) {

    limit = limit || 10;
    page = page || 1;
    sort = sort || "asc";
    category = category || null;
    available = available || true;

    try {
      const query = { status:available };
      if (category) {
        query.category = category;
      }
      const productsFind = Products.paginate(
        query,
        { page, limit, sort:{price:sort}, lean: true }
      );
      return productsFind;
    } catch (error) {
      console.log("Error while getting all products " + error);
      throw new Error("Error getting all products ");
    }
  }
  static async getAllWithStock() {
    try {
      return Products.find({ stock: { $gt: 0 } }).lean();
    } catch (error) {
      console.log("Error get all products with Stock " + error);
      throw new Error("Error get all products with Stock ");
    }
  }
  static async getWithCode(code) {
    try {
      const result = await Products.find({ code }).lean();
      return result;
    } catch (error) {
      console.log("Error get  products with Code " + error);
      throw new Error("Error get products with Code ");
    }
  }
  static async getAllWithLimit(limit, skip = 0) {
    try {
      return Products.find().skip(skip).limit(limit).lean();
    } catch (error) {
      console.log("Error get all products with limit " + error);
      throw new Error("Error get all products with limit");
    }
  }
  static async getById(id) {
    try {
      return Products.findOne({ _id: id }).lean();
    } catch (error) {
      console.log("Error getting one product " + error);
      throw new Error("Error getting one product");
    }
  }
  //get all products in one array the ids
  static async getByIdInMatriz(productIds) {
    try {
      
      return Products.find({ _id: { $in: productIds } }).lean();
    } catch (error) {
      console.log("Error getting one product " + error);
      throw new Error("Error getting one product");
    }
  }
  static async add(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    try {
      const newProduct = new Products(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      );

      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      console.log("Error add product " + error);
      throw new Error("Error add product");
    }
  }
  static async update(id, products) {
    try {
      const updateProduct = Products.findByIdAndUpdate(id, products);

      /* const savedProduct = await newProduct.save(); */
      return updateProduct;
    } catch (error) {
      console.log("Error add product " + error);
      throw new Error("Error add product");
    }
  }
  static async remove(id) {
    try {
      const result = await Products.findByIdAndDelete(id).lean();

      return result;
    } catch (error) {
      console.log("Error remove product " + error + " " + error.name);
      throw error; // Re-lanzar el error para que se maneje en el controlador
    }
  }
}

export default ProductsDao;
