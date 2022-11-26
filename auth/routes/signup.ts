import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
  res.send("Hello there!");
});

export { router as signupRouter };
