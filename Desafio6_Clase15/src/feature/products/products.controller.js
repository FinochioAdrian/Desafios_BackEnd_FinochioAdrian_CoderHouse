import Products from "./product.dao.js";



async function getAll(req, res) {
  try {
    let { limit, skip } = req.query;
    // /?limit=1
    // Check the existence of the query.limit
    if (limit && !skip) {
      limit = parseInt(limit, 10);

      // Verify if it's a valid number
      if (!isNaN(limit) && limit > 0) {
        // Apply limit to the list of products
        let limitedProducts = await Products.getAllWithLimit(limit);
        return res.send({ products: limitedProducts });
      } else {
        return res.status(400).send({
          status: "error",
          error: 'The "limit" parameter must be a positive integer.',
        });
      }
    }
    // /?skip=1
    // Check the existence of the query.skip
    if (skip && !limit) {
      skip = parseInt(skip, 10);

      // Verify if it's a valid number
      if (!isNaN(skip) && skip > 0) {
        // Apply starting point to the list of products
        let limitedProducts = await Products.getAllWithLimit(skip);
        return res.send({ products: limitedProducts });
      } else {
        return res.status(400).send({
          status: "error",
          error: 'The "skip" parameter must be a positive integer.',
        });
      }
    }
    // /?limit=1&skip=1
    // Check the existence of the query.skip && query.limit
    if (limit && skip) {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);

      // Verify limit if it's a valid number
      if (isNaN(limit) && !(limit > 0)) {
        // Apply limit to the list of products
        return res.status(400).send({
          status: "error",
          error: 'The "limit" parameter must be a positive integer.',
        });
      }
      // Verify skip if it's a valid number
      if (isNaN(skip) && !(skip > 0)) {
        // Apply limit to the list of products
        return res.status(400).send({
          status: "error",
          error: 'The "skip" parameter must be a positive integer.',
        });
      }
      let limitedProducts = await Products.getAllWithLimit(limit, skip);
      return res.send({ products: limitedProducts });
    }
    let products = await Products.getAll();
    res.send({ products });
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message });
  }
}

async function get(req, res) {
  try {
    // Check the existence of the query.limit
    if (!req.params.pid) {
      return res.status(400).send({
        status: "error",
        error: "Search parameter 'id' is required in the URL.",
      });
    }
    let { pid } = req.params;

    try {
      let productFound = await Products.getById(pid);
      if (!productFound) {
        return res
          .status(404)
          .send({ status: "fail", msg: `Product with ID ${pid} not found.` });
      }
      // Product found, send it in the response
      return res.send({ product: productFound });
    } catch (error) {
      // Handle specific error when the product is not found
      return res.status(404).send({
        status: "error",
        error: `Product with ID ${pid} not found.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({ error: error.message });
  }
}

async function create(req, res) {
  const { body } = req;
  // Validate the request body against the schema
  try {
    console.table(body);
    console.log(body);
    const payload = await Products.add({ ...body });
    console.log("payload", payload);
    res.status(201).send({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error occurring when creating this product.",
    });
  }
}

async function update(req, res) {
  try {
    // Check that the pid is exist
    if (!req.params || !req.params.pid) {
      return res.status(400).send({
        status: "error",
        error: "Search parameter 'id' is required in the URL.",
      });
    }

    let { pid } = req.params;
    // Check that the pid is of type string, if not send to response
    if (!typeof pid === "string") {
      return res.status(422).send({
        status: "error",
        error: "The parameter 'id' in the URL is not a valid product ID.",
      });
    }
    const product = req.body;

    // Update products
    console.log(product);
    let productUpdate = await Products.update(pid, product);
    console.log(productUpdate);
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
    // Check the existence pid
    if (!req.params.pid) {
      return res.status(400).send({
        status: "error",
        error: "Search parameter 'id' is required in the URL.",
      });
    }

    let { pid } = req.params;
    // Check that the pid is of type string, if not send to response
    if (!typeof pid === "string") {
      return res.status(422).send({
        status: "error",
        error: "The parameter 'id' in the URL is not a valid product ID.",
      });
    }

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
