import {
  Consumer,
  NotFoundException,
  OrderCancelledEvent,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Order } from "../../models/order";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  consumerGroup = "payments-service-order-cancelled";
  topic: Topics.OrderCancelled = Topics.OrderCancelled;

  async onMessage(message: {
    id: Types.ObjectId;
    ticket: { id: Types.ObjectId };
  }) {
    const order = await Order.findById(message.id);
    if (!order) throw new NotFoundException("Order");

    order.status = OrderStatus.Cancelled;
    await order.save();

    console.log(`Consumed order-cancelled Message: ${message.id}`);
  }
}
