import {
  Consumer,
  NotFoundException,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedProducer } from "../producers/ticket-updated-producer";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  consumerGroup = "tickets-service-order-created";
  topic: Topics.OrderCreated = Topics.OrderCreated;

  async onMessage(message: {
    id: Types.ObjectId;
    status: OrderStatus;
    userId: Types.ObjectId;
    expiresAt: string;
    ticket: { id: Types.ObjectId; price: number };
  }) {
    const ticket = await Ticket.findById(message.ticket.id);
    if (!ticket) throw new NotFoundException("Ticket");

    ticket.set({ orderId: message.id });
    await ticket.save();

    const { id, title, price, userId, orderId } = ticket;
    new TicketUpdatedProducer().publish({
      id,
      title,
      price,
      userId,
      orderId,
    });

    console.log(`Consumed order-created Message: ${message.id}`);
  }
}
