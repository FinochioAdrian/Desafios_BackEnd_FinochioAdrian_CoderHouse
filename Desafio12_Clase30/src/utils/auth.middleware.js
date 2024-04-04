export default function authorization(role) {
  return async (req, res, next) => {
    if (!req.user) {
      if (req.accepts("html")) {
        req.flash("errorValidation", "Unauthorized");
        return res.redirect("/login");
      }
      return res.status(401).send({ error: "Unauthorized" });
    }
    /* if(req.user.role!=role) return res.status(403).send({error:"No permissions"}) */
    next()
  };
}
