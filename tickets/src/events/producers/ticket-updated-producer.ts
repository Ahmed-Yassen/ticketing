import {
  Producer,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  Topics,
} from "@ayticketing/common";

export class TicketUpdatedProducer extends Producer<TicketUpdatedEvent> {
  topic: Topics.TicketUpdated = Topics.TicketUpdated;
}
