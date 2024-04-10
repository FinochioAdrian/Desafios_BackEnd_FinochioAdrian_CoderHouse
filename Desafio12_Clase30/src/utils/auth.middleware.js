export default function authorization(role="everyone") {
  return async (req, res, next) => {

    if (!req.user) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "Unauthorized");
        return res.redirect("/login");
      }
      return res.status(401).send({ error: "Unauthorized" });
    }
  

    if(!role||role=="everyone"){
      return next();
    }

    if (req.user.role != role) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "No permissions");
        return res.redirect("/");
      }
      return res.status(403).send({ error: "No permissions" });
    }

  return next();
  };
}
