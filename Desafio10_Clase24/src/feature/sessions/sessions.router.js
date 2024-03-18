import Router from "express";

import UsersDAO from "../users/users.dao.js";
import { createHash, isValidPassword } from "../../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("infoMsg", "Inicie Sesión");

    // Verificar si el cliente acepta HTML
    if (req.accepts("html")) {
      return res.redirect("/login");
    }

    // Si el cliente no acepta HTML, devolver respuesta JSON
    return res.status(200).json({ message: "Usuario registrado exitosamente" });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    
    if (!req.user) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "Invalid credentials");
        return res.redirect("/login");
      }
      return res.status(400).send({
        status: "error",
        msg: "Invalid credentials",
      });
    }
    const { first_name, last_name, age, email } = req.user;
    req.session.user = {
      first_name,
      last_name,
      age,
      email,
    };

    

    if (req.accepts("html")) {
      return res.redirect("/products");
    }

    return res.send({ status: "success", payload: user });
  }
);
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

router.get("/github", passport.authenticate('github',{scope:['user:email']}),async (req,res)=>{})
router.get("/githubcallback", passport.authenticate('github',{failureRedirect:'/login',failureFlash:true}),async (req,res)=>{

  req.session.user = req.user;
  res.redirect('/')
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

export default router;
