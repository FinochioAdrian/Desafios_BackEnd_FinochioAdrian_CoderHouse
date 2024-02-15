import express from "express";
import * as ViewsController from "./views.controller.js";

const router = express.Router();



router.get("/", (req, res) => res.redirect("/home"))

router.get("/home",ViewsController.home)
router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts",{title:"realTimeProducts"});
});
router.get("/chat", async (req, res) => {
  res.render("chat",{stylesheet:"/css/chat.css", title:"Chat con Socket.IO"});
});
router.get("/addProducts", async (req, res) => {
  res.render("addProducts",{title:"addProducts"});
});

export default router;
