import { Router } from "express";

const router = Router();

router.post("", async (req, res) => {
  res.send("create-order");
});

export { router as createOrder };
