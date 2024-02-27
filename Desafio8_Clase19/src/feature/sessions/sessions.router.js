import Router from "express";

import UsersDAO from "../users/users.dao.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    let age = parseInt(req.body.age);

    if (!first_name || !last_name || !email || !age || !password) {
      req.flash("errorEmptyField", "Hay campos vacíos");
      return res.redirect("/register");
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);

    if (emailUsed) {
      req.flash("errorValidation", "Email en uso");
      return res.redirect("/register");
    } else {
      await UsersDAO.insert({ first_name, last_name, age, email, password });
      delete req.body.password; //eliminamos contraseña
      req.flash("infoMsg", "Inicie Sesión");
      return res.redirect("/login");
    }
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);
    return res.status(error?.status || 500).send("Internal Server error");
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    req.flash("errorEmptyField", "Field name o password is empty");
    return res.redirect("/login");
  }
let user
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    user = {
      id_: 0,
      age: 0,
      first_name: "Admin",
      last_name: "Coder",
      email:  "adminCoder@coder.com",
      role: "admin",
    };
  } else {
     user = await UsersDAO.getUserByCreds(email, password);
  }

  if (!user) {
    req.flash("errorValidation", "User email or password is incorrect");

    return res.redirect("/login");
  } else {
    delete req.body.password;
    delete user.password;
    req.session.user = user;
    return res.redirect("/products");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

export default router;
