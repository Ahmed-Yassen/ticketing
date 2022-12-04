import mongoose from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
  userId: number;
}

interface TicketDocument extends TicketAttributes, mongoose.Document {}

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
      type: Number,
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

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

ticketSchema.statics.build = (attrs: TicketAttributes) => {
  return new Ticket(attrs);
};

export { Ticket };
