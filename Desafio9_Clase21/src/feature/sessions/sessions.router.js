import Router from "express";

import UsersDAO from "../users/users.dao.js";
import { createHash, isValidPassword } from "../../utils.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    let age = parseInt(req.body.age);

    if (!first_name || !last_name || !email || !age || !password) {
      const errorMessage = "Hay campos vacíos";

      // Verificar si el cliente acepta HTML
      if (req.accepts("html")) {
        req.flash("errorEmptyField", errorMessage);
        return res.redirect("/register");
      }

      // Si el cliente no acepta HTML, devolver respuesta JSON
      return res.status(400).json({ errorEmptyField: errorMessage });
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);

    if (emailUsed) {
      const errorMessage = "Email en uso";

      // Verificar si el cliente acepta HTML
      if (req.accepts("html")) {
        req.flash("errorValidation", errorMessage);
        return res.redirect("/register");
      }

      // Si el cliente no acepta HTML, devolver respuesta JSON
      return res.status(400).json({ errorValidation: errorMessage });
    } else {
      let user = {
        first_name,
        last_name,
        age,
        email,
        password: createHash(password),
      };
      await UsersDAO.insert(user);
      delete req.body.password; //eliminamos contraseña

      req.flash("infoMsg", "Inicie Sesión");

      // Verificar si el cliente acepta HTML
      if (req.accepts("html")) {
        return res.redirect("/login");
      }

      // Si el cliente no acepta HTML, devolver respuesta JSON
      return res
        .status(200)
        .json({ message: "Usuario registrado exitosamente" });
    }
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);

    // Verificar si la solicitud es una API
    if (req.accepts("html")) {
      return res.status(error?.status || 500).send("Internal Server error");
    }
    return res
      .status(error?.status || 500)
      .json({ error: "Internal Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
  if (!email || !password) {
    if (req.accepts("html")) {
      req.flash("errorEmptyField", "Values name o password is empty");
      return res.redirect("/login");
    }
    return res.status(400).send({
      status: "error",
      msg: "Error Empty Values: Field name o password is empty",
    });
  }
  let user;
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    user = {
      _id: 0,
      age: 0,
      first_name: "Admin",
      last_name: "Coder",
      email: "adminCoder@coder.com",
      role: "admin",
      password: createHash(password),
    };
  } else {
    user = await UsersDAO.getUserByEmail(email);

  }

  if (!user) {
    if (req.accepts("html")) {
      req.flash("errorValidation", "User not Found");
      return res.redirect("/login");
    }

    return res.status(400).send({ status: "error", msg: "User not found" });
  }
  if (!isValidPassword(user, password)) {
    if (req.accepts("html")) {
      req.flash("errorValidation", "Incorrect password");
      return res.redirect("/login");
    }

    return res.status(403).send({ status: "error", msg: "Incorrect password" });
  }

  delete req.body.password;
  delete user.password;


  
  req.session.user = user;

  if (req.accepts("html")) {
    return res.redirect("/products");
  }

  return res.send({ status: "success", payload: user });

    
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);

    // Verificar si la solicitud es una API
    if (req.accepts("html")) {
      return res.status(error?.status || 500).send("Internal Server error");
      
    }
    return res
        .status(error?.status || 500)
        .json({ error: "Internal Server error" });
  }
});
router.post("/password-reset", async (req, res) => {
  try {
    let { email, password } = req.body;

  if (!email || !password) {
    if (req.accepts("html")) {
      req.flash("errorEmptyField", "Values name o password is empty");
      return res.redirect("/password-reset");
    }

    return res.status(400).send({
      status: "error",
      msg: "Error Empty Values: Field name o password is empty",
    });
  }

  let user = await UsersDAO.getUserByEmail(email);

  if (!user) {
    if (req.accepts("html")) {
      req.flash("errorValidation", "User not Found");
      return res.redirect("/password-reset");
    }

    return res.status(400).send({ status: "error", msg: "User not found" });
  }

  user.password = createHash(password);

await UsersDAO.newPassword(user)

  delete req.body.password;
  delete user.password;

  if (req.accepts("html")) {
    req.flash("infoMsg", "Inicie Sesión");
    return res.redirect("/login");
  }

  return res.send({ status: "success" });
  } catch (error) {
    console.log("❌ ~ router.post ~ error:", error);

    // Verificar si la solicitud es una API
    if (req.accepts("html")) {
      
      return res.status(error?.status || 500).send("Internal Server error");
      
    }
    return res
        .status(error?.status || 500)
        .json({ error: "Internal Server error" });
  }
  
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

export default router;
