import { requireAuth } from "@ayticketing/common";
import { Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.get("", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).populate("ticketId");

  res.send(orders);
});

export { router as getOrders };
