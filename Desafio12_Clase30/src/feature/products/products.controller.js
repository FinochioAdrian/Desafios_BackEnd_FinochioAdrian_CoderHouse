import {productsService as Products} from "./repository/index.js";

async function getAll(req, res) {
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
    console.log("❌ ~ getAll ~ error:", error);
    return res.status(error.status || 500).send({ error: error.message });
  }
}

async function get(req, res) {
  try {
    let { pid } = req.params;

    let productFound = await Products.getById(pid);
    if (!productFound) {
      return res
        .status(404)
        .send({ status: "fail", msg: `Product with ID ${pid} not found.` });
    }
    // Product found, send it in the response
    return res.send({ product: productFound });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({ error: error.message });
  }
}

async function create(req, res) {
  const { body } = req;
  // Validate the request body against the schema
  try {
    const result = await Products.getWithCode(body.code);

    if (result.length > 0) {
      return res.status(409).send({
        status: "fail",
        msg: `The 'code': ${body.code} $ field already exists in the database.`,
      });
    }

    if (req.files) {
      const filePath = req.files;
      const thumbnails = filePath.map((value) => {
        return value.path.replace(/\\/g, "/");
      });
      body.thumbnails = thumbnails;
    }

    const payload = await Products.add({ ...body });

    res.status(201).send({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error occurring when creating this product." + error,
    });
  }
}

async function update(req, res) {
  try {
    let { pid } = req.params;
    const product = req.body;

    let result = await Products.getWithCode(product.code);
    result = JSON.parse(JSON.stringify(result));

    if (result.length > 0 && result._id !== pid) {
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
    console.error(error);
    res
      .status(500)
      .send({ error: "Error occurring when updating this product." });
  }
}

async function remove(req, res) {
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
    console.error(`Error: ${error.message}`);

    res
      .status(error.status || 500)
      .send({ status: "error", message: error.message });
  }
}

export { getAll, get, create, update, remove };
