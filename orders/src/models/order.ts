import { OrderStatus } from "@ayticketing/common";
import mongoose from "mongoose";

interface OrderAttributes {
  userId: mongoose.Schema.Types.ObjectId;
  status: OrderStatus;
  expiresAt: Date;
  ticketId: mongoose.Schema.Types.ObjectId;
}

interface OrderDocument extends OrderAttributes, mongoose.Document {}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(orderAttrs: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.statics.build = (orderAttrs: OrderAttributes) => {
  return new Order(orderAttrs);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
