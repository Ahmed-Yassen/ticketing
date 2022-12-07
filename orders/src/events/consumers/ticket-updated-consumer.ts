import {
  Consumer,
  NotFoundException,
  TicketUpdatedEvent,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  consumerGroup = "orders-service-ticket-updated";
  topic: Topics.TicketUpdated = Topics.TicketUpdated;

  async onMessage(message: {
    id: Types.ObjectId;
    title: string;
    price: number;
    userId: Types.ObjectId;
  }) {
    const ticket = await Ticket.findById(message.id);
    if (!ticket) throw new NotFoundException("Ticket");

    const { title, price } = message;
    ticket.set({ title, price });
    await ticket.save();

    console.log(`Consumed ticket-updated Message: ${message.id}`);
  }
}
