import { Consumer, TicketCreatedEvent, Topics } from "@ayticketing/common";
import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  consumerGroup = "orders-service";
  topic: Topics.TicketCreated = Topics.TicketCreated;

  async onMessage(message: {
    id: Types.ObjectId;
    title: string;
    price: number;
    userId: Types.ObjectId;
  }) {
    const { id, title, price } = message;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    console.log(`Consumed ticket-created Message: ${id}`);
  }
}
