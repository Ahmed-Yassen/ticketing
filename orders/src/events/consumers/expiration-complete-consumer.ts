import {
  Consumer,
  ExpirationCompleteEvent,
  NotFoundException,
  OrderStatus,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Order } from "../../models/order";
import { OrderCancelledProducer } from "../producers/order-cancelled-producer";

export class ExpirationCompleteConsumer extends Consumer<ExpirationCompleteEvent> {
  consumerGroup = "orders-service-expiration-complete";
  topic: Topics.ExpirationComplete = Topics.ExpirationComplete;

  async onMessage(message: { orderId: Types.ObjectId }) {
    const order = await Order.findById(message.orderId);
    if (!order) throw new NotFoundException("Order");

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledProducer().publish({
      id: order.id,
      ticket: {
        id: order.ticketId,
      },
    });
  }
}
