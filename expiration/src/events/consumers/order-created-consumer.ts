import {
  Consumer,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  consumerGroup = "expiration-service-order-created";
  topic: Topics.OrderCreated = Topics.OrderCreated;

  async onMessage(message: {
    id: Types.ObjectId;
    status: OrderStatus;
    userId: Types.ObjectId;
    expiresAt: string;
    ticket: { id: Types.ObjectId; price: number };
  }) {
    const delay = new Date(message.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: message.id }, { delay });

    console.log(`Consumed order-created Message: ${message.id}`);
  }
}
