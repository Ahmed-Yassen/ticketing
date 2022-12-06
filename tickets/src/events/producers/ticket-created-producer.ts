import { Producer, TicketCreatedEvent, Topics } from "@ayticketing/common";

export class TicketCreatedProducer extends Producer<TicketCreatedEvent> {
  topic: Topics.TicketCreated = Topics.TicketCreated;
}
