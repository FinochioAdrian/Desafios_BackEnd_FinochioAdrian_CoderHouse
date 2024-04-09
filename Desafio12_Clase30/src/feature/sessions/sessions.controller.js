import { usersService } from "../users/repository/users.service.js";
import { createHash, generateToken } from "../../utils.js";

async function register(req, res) {
  // Verificar si el cliente acepta HTML
  if (req.accepts("html")) {
    req.flash("infoMsg", "Inicie Sesión");
    return res.redirect("/login");
  }

  // Si el cliente no acepta HTML, devolver respuesta JSON
  return res.status(200).json({ message: "Usuario registrado exitosamente" });
}

async function login(req, res) {
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

async function passwordReset(req, res) {
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

    let user = await usersService.getUserByEmail(email);

    if (!user) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "User not Found");
        return res.redirect("/password-reset");
      }

      return res.status(400).send({ status: "error", msg: "User not found" });
    }

    user.password = createHash(password);

    await usersService.newPassword(user);

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
}

async function githubcallback(req, res) {
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

async function logout(req, res) {
  res.clearCookie("jwt");
  if (req.accepts("html")) return res.redirect("/login");
  res.status(200).json({ status: 200, msg: "Logged out" });
}

async function failRegister(req, res) {
  if (req.accepts("html"))
    return res.render("403", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(403).send({ error: "Failed register" });
}

async function failLogin(req, res) {
  if (req.accepts("html"))
    return res.render("401", {
      title: "Oops! Access Denied",
      stylesheet: "/css/errorPage.css",
    });
  return res.status(401).send({ error: "Failed login" });
}

async function current(req, res) {
  res.json({ status: "success", payload: req.user });
}

export default {
  register,
  login,
  passwordReset,
  githubcallback,
  logout,
  failRegister,
  failLogin,
  current,
};
