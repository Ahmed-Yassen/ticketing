import {
  BadRequestException,
  NotAuthorizedException,
  NotFoundException,
  requireAuth,
  validateRequest,
} from "@ayticketing/common";
import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { TicketUpdatedProducer } from "../events/producers/ticket-updated-producer";
import { Ticket } from "../models/ticket";

const router = Router();

router.put(
  "/update/:id",
  requireAuth,
  [
    body("title")
      .optional()
      .not()
      .isEmpty()
      .isString()
      .withMessage("Title should be valid"),
    body("price")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("Price must be greater than 0"),
    param("id").isMongoId().withMessage("Ticket id should be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundException("Ticket");

    if (ticket.orderId)
      throw new BadRequestException("Cannot edit a reserved ticket");

    if (ticket.userId.toString() !== req.userId.toString())
      throw new NotAuthorizedException();

    const filteredFields: { title?: string; price?: number } = {};
    for (let field in req.body) {
      if (field === "title" || field === "price")
        filteredFields[field] = req.body[field];
    }

    ticket.set(filteredFields);
    await ticket.save();

    await new TicketUpdatedProducer().publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
