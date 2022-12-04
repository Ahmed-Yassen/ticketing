import { Router } from "express";
import { requireAuth } from "@ayticketing/common";
import { User } from "../models/user";
const router = Router();

router.get("/currentuser", requireAuth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  res.send({ currentUser: user });
});

export { router as currentUserRouter };
