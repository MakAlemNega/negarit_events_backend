import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/mine", authenticate, getMyOrders);

export default router;
