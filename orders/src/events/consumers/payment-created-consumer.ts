import {
  Consumer,
  NotFoundException,
  OrderStatus,
  PaymentCreatedEvent,
  Topics,
} from "@ayticketing/common";
import { Types } from "mongoose";
import { Order } from "../../models/order";

export class PaymentCreatedConsumer extends Consumer<PaymentCreatedEvent> {
  consumerGroup = "orders-service-payment-created";
  topic: Topics.PaymentCreated = Topics.PaymentCreated;

  async onMessage(message: { id: Types.ObjectId; orderId: Types.ObjectId }) {
    const order = await Order.findById(message.orderId);
    if (!order) throw new NotFoundException("Order");

    order.status = OrderStatus.Completed;
    await order.save();

    console.log(`Consumed payment-created Message: ${message.orderId}`);
  }
}
