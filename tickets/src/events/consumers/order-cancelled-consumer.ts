import {
  Consumer,
  NotFoundException,
  OrderCancelledEvent,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedProducer } from "../producers/ticket-updated-producer";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  consumerGroup = "tickets-service-order-cancelled";
  topic: Topics.OrderCancelled = Topics.OrderCancelled;

  async onMessage(message: {
    id: Types.ObjectId;
    ticket: { id: Types.ObjectId };
  }) {
    const ticket = await Ticket.findById(message.ticket.id);
    if (!ticket) throw new NotFoundException("Ticket");

    ticket.set({ orderId: undefined });
    await ticket.save();

    const { id, title, price, userId, orderId } = ticket;
    new TicketUpdatedProducer().publish({
      id,
      title,
      price,
      userId,
      orderId,
    });

    console.log(`Consumed order-cancelled Message: ${message.id}`);
  }
}
