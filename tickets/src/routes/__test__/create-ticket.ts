import { Router } from "express";
import { requireAuth } from "@ayticketing/common";

const router = Router();

router.post("/create", requireAuth, (req, res) => {
  if (req.cookies.Authentication) {
    console.log(req.cookies.Authentication);
    return res.status(201).send();
  }
  res.status(500).send();
});

export { router as createTicketRouter };
