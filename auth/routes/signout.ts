import { Router } from "express";

const router = Router();

router.post("/signout", (req, res) => {
  res.send("Hello there!");
});

export { router as signoutRouter };
