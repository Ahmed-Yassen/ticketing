import {
  Consumer,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Order } from "../../models/order";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  consumerGroup = "payments-service-order-created";
  topic: Topics.OrderCreated = Topics.OrderCreated;

  async onMessage(message: {
    id: Types.ObjectId;
    status: OrderStatus;
    userId: Types.ObjectId;
    expiresAt: string;
    ticket: { id: Types.ObjectId; price: number };
  }) {
    const order = Order.build({
      id: message.id,
      price: message.ticket.price,
      userId: message.userId,
      status: message.status,
    });

    await order.save();

    console.log(`Consumed order-created Message: ${message.id}`);
  }
}
