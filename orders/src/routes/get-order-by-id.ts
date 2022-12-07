import { Router } from "express";

const router = Router();

router.get("/:id", async (req, res) => {
  res.send("get-order-by-id");
});

export { router as getOrderById };
