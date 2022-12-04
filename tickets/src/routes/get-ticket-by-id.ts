import { NotFoundException, validateRequest } from "@ayticketing/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ticket id.")],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket");

    res.send(ticket);
  }
);

export { router as getTicketById };
