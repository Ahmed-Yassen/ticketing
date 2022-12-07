import {
  BadRequestException,
  NotFoundException,
  requireAuth,
  validateRequest,
} from "@ayticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";
import mongoose, { Schema } from "mongoose";

const router = Router();

const EXPIRATION_WINDOW_IN_SECONDS = 15 * 60; //- the user should pay the order in 15 minutes

router.post(
  "",
  requireAuth,
  [body("ticketId").isMongoId().withMessage("Ticket ID must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = new mongoose.Types.ObjectId(req.body.ticketId);

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket");

    const isTicketReserved = await ticket.isReserved();
    if (isTicketReserved)
      throw new BadRequestException("Ticket is already reserved");

    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_WINDOW_IN_SECONDS
    );

    const order = Order.build({
      userId: req.userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticketId,
    });
    await order.save();

    res.status(201).send(order);
  }
);

export { router as createOrder };
