import { Router } from "express";
import { requireAuth } from "@ayticketing/common";
const router = Router();

router.get("/currentuser", requireAuth, async (req, res) => {
  res.send({ currentUser: req.user });
});

export { router as currentUserRouter };
