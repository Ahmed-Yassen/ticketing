import mongoose, { Types } from "mongoose";

interface PaymentAttributes {
  orderId: Types.ObjectId;
  stripeId: string;
}

interface PaymentDocument extends mongoose.Document, PaymentAttributes {}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(paymentAttrs: PaymentAttributes): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: Types.ObjectId,
      required: true,
    },
    stripeId: {
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

paymentSchema.statics.build = (attrs: PaymentAttributes) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
