import mongoose from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
}

interface TicketDocument extends mongoose.Document, TicketAttributes {}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(ticketAttrs: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
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

ticketSchema.statics.build = (ticketAttrs: TicketAttributes) => {
  return new Ticket(ticketAttrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
