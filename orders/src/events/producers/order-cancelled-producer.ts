import { Producer, Topics, OrderCancelledEvent } from "@ayticketing/common";

export class OrderCancelledProducer extends Producer<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
}
