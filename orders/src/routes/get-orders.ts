import { Router } from "express";

const router = Router();

router.get("", async (req, res) => {
  res.send("get-orders");
});

export { router as getOrders };
