import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.post("/signout", requireAuth, (req, res) => {
  res.clearCookie("Authentication");
  req.user = undefined;
  res.send({});
});

export { router as signoutRouter };
