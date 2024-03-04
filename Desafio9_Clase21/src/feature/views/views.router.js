// Import the express module
import express from "express";

import * as ViewsController from "./views.controller.js";

import viewValidatorMiddleware, {
  runValidation,
} from "./viewValidationMiddleware.js";
import auth from "./auth.middleware.js";
// Create an express router instance
const router = express.Router();

// Define a GET route for the root URL ("/") that redirects to the "/home" route
router.get("/", (req, res) => res.redirect("/login"));

// Define a GET route for the "/home" URL that renders the home view
router.get("/home", auth, ViewsController.home);

// Define a GET route for the "/products" URL that validates the query parameters using the viewValidatorMiddleware function
// and then renders the products view
router.get(
  "/products",
  auth,
  viewValidatorMiddleware("getAllQueries"),
  runValidation,
  ViewsController.products
);

// Define a GET route for the "/product/:pid" URL that renders the product view
router.get("/product/:pid", auth,ViewsController.product);

// Define a GET route for the "/realTimeProducts" URL that renders the realTimeProducts view
router.get("/realTimeProducts",auth, async (req, res) => {
  res.render("realTimeProducts", { title: "realTimeProducts" });
});

// Define a GET route for the "/carts/:cid" URL that validates the cart ID using the viewValidatorMiddleware function
// and then renders the carts view
router.get(
  "/carts/:cid",auth,
  viewValidatorMiddleware("isCID"),
  runValidation,
  ViewsController.carts
);

// Define a POST route for the "/carts/:cid/product/:pid" URL that validates the cart ID and product ID using the viewValidatorMiddleware function
// and then adds the product to the cart
router.post(
  "/carts/:cid/product/:pid",auth,
  viewValidatorMiddleware("isCID"),
  viewValidatorMiddleware("isPID"),
  runValidation,
  ViewsController.addProductInCart
);

// Define a GET route for the "/chat" URL that renders the chat view
router.get("/chat",auth, async (req, res) => {
  res.render("chat", {
    stylesheet: "/css/chat.css",
    title: "Chat con Socket.IO",
  });
});

// Define a GET route for the "/addProducts" URL that renders the addProducts view
router.get("/addProducts",auth, async (req, res) => {
  res.render("addProducts", { title: "addProducts" });
});

// Add in Desafio8_Clase19

router.get("/login", (req, res) => {
  try {
    // render login page with message if there is
    const dangerMsg = req.flash("errorValidation");
    const emptyField = req.flash("errorEmptyField");
    const infoMSG = req.flash("infoMsg");
    if (req.session.user) {
      return res.redirect("/products");
    } else {
      return res.render("login", {
        dangerMsg,
        warningMSG: emptyField,
        infoMSG,
      });
    }
  } catch (error) {
    console.log("❌  ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
});

router.get("/register", (req, res) => {
  try {
    // render login page with message if there is
    const errorValidation = req.flash("errorValidation");
    const emptyField = req.flash("errorEmptyField");

    return res.render("register", {
      dangerMsg: errorValidation,
      warningMSG: emptyField,
    });
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
});
router.get("/chatBot", async (req, res) => {
  res.render("chatBot",{stylesheet:"/css/chat.css", title:"ChatBot con Socket.IO"});
});

// add desafio 9
router.get('/password-reset', (req, res) => {
  try {
    // render login page with message if there is
    const errorValidation = req.flash("errorValidation");
    const emptyField = req.flash("errorEmptyField");

    res.render("passwordReset", {
      dangerMsg: errorValidation,
      warningMSG: emptyField,
    });
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
 
});
// Export the router instance


export default router;
