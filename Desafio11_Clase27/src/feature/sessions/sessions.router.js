import Router from "express";

import UsersDAO from "../users/users.dao.js";
import { createHash, generateToken, passportCall,auth } from "../../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passportCall("register", {
    failureRedirect: "/register",
    failureFlash: true,
  }),

  async (req, res) => {
    

    // Verificar si el cliente acepta HTML
    if (req.accepts("html")) {
      req.flash("infoMsg", "Inicie Sesión");
      return res.redirect("/login");
    }

    // Si el cliente no acepta HTML, devolver respuesta JSON
    return res.status(200).json({ message: "Usuario registrado exitosamente" });
  }
);


router.post(
  "/login",
  passportCall("local-login", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    const user = req.user;
    const access_token = generateToken(user);

    if (req.accepts("html")) {
      return res
        .cookie("jwt", access_token, {
          signed: true,
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        })
        .redirect("/products");
    }
    res
      .cookie("jwt", token, {
        signed: true,
        httpOnly: true,
        maxAge: 3 * 60 * 60,
      })
      .json({ status: 200, msg: "Logged in" });
  }
);

router.post("/password-reset", async (req, res) => {
  try {
    let { email, password } = req.body;
    /// copiar para el msg flash
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

    await UsersDAO.newPassword(user);
 

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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    if (!user) {
      if (req.accepts("html"))
        return res.render("401", {
          title: "Oops! Access Denied",
          stylesheet: "/css/errorPage.css",
        });

      return res
        .status(401)
        .send({ status: "error", error: "Invalid credentials" });
    }

    const access_token = generateToken(user);

    if (req.accepts("html")) {
      return res
        .cookie("jwt", access_token, {
          signed: true,
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        })
        .redirect("/products");
    }

    res
      .cookie("jwt", access_token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .json({ status: 200, msg: "Logged in" });
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  if (req.accepts("html")) return res.redirect("/login");
  res.status(200).json({ status: 200, msg: "Logged out" });
});

router.get("/failregister", (req, res) => {
  if (req.accepts("html"))
    return res.render("403", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(403).send({ error: "Failed register" });
});

router.get("/failLogin", (req, res) => {
  if (req.accepts("html"))
    return res.render("401", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(401).send({ error: "Failed login" });
});

router.get(
  "/current",passportCall("jwt"),auth,
  (req, res) => {
    res.json({ status: "success", payload: req.user });
  }
);

export default router;
