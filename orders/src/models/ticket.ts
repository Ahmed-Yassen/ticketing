import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

export interface TicketAttributes {
  title: string;
  price: number;
}

interface TicketDocument extends mongoose.Document, TicketAttributes {
  isReserved(): Promise<boolean>;
}

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

ticketSchema.methods.isReserved = async function () {
  //- to findout if the ticket is reserved, find an order where order.ticketId=ticketId *and* order.status != cancelled
  const orderHasTicket = await Order.findOne({
    ticketId: this.id,
    status: { $not: { $eq: OrderStatus.Cancelled } },
  });

  return !!orderHasTicket; //- to return either true or false as indicated by the promise return type, instead of the order itself
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
