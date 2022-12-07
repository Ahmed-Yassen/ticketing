import { Producer, OrderCreatedEvent, Topics } from "@ayticketing/common";

export class OrderCreatedProducer extends Producer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
}
