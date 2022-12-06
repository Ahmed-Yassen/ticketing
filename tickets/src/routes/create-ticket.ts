import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ayticketing/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedProducer } from "../events/producers/ticket-created-producer";

const router = Router();

router.post(
  "/create",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage("Title should be valid"),
    body("price")
      .isFloat({ min: 1 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.userId });
    await ticket.save();

    await new TicketCreatedProducer().publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
