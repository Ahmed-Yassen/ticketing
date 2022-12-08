import {
  Consumer,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  consumerGroup = "tickets-service-order-created";
  topic: Topics.OrderCreated = Topics.OrderCreated;

  async onMessage(message: {
    id: Types.ObjectId;
    status: OrderStatus;
    userId: Types.ObjectId;
    expiresAt: string;
    ticket: { id: Types.ObjectId; price: number };
  }) {}
}
