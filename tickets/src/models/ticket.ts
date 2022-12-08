import mongoose from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
  userId: mongoose.Types.ObjectId;
}

interface TicketDocument extends TicketAttributes, mongoose.Document {
  orderId?: mongoose.Types.ObjectId;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(ticketAttrs: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    orderId: {
      type: mongoose.SchemaTypes.ObjectId,
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

ticketSchema.statics.build = (attrs: TicketAttributes) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
