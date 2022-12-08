import { Consumer, OrderCancelledEvent, Topics } from "@ayticketing/common";
import { Types } from "mongoose";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  consumerGroup = "tickets-service-order-cancelled";
  topic: Topics.OrderCancelled = Topics.OrderCancelled;

  async onMessage(message: {
    id: Types.ObjectId;
    ticket: { id: Types.ObjectId };
  }) {}
}
