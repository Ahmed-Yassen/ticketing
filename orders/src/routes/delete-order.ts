import { Router } from "express";

const router = Router();

router.delete("/:id", async (req, res) => {
  res.send("delete-order");
});

export { router as deleteOrder };
