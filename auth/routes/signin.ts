import { Router } from "express";

const router = Router();

router.post("/signin", (req, res) => {
  res.send("Hi there!");
});

export { router as signinRouter };
