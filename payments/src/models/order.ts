import { OrderStatus } from "@ayticketing/common";
import mongoose, { Types } from "mongoose";

interface OrderAttributes {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  price: number;
  status: OrderStatus;
}

interface OrderDocument extends mongoose.Document {
  userId: Types.ObjectId;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(orderAttrs: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
  new Order({
    _id: orderAttrs.id,
    price: orderAttrs.price,
    userId: orderAttrs.userId,
    statuse: orderAttrs.status,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
