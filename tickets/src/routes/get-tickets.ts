import { Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("", async (req, res) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
});

export { router as getTicketsRouter };
