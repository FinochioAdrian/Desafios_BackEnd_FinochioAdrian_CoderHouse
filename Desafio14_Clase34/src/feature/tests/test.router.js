import { Router } from 'express';
import testsController from "./test.controller.js";


const router = new Router();

router.get("/",testsController.loggerTest)



export default router;