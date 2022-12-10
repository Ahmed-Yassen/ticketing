import mongoose from "mongoose";
import { EnvMissingException } from "@ayticketing/common";
import app from "./app";
import { TicketCreatedConsumer } from "./events/consumers/ticket-created-consumer";
import { TicketUpdatedConsumer } from "./events/consumers/ticket-updated-consumer";
import { ExpirationCompleteConsumer } from "./events/consumers/expiration-complete-consumer";
import { PaymentCreatedConsumer } from "./events/consumers/payment-created-consumer";

const start = async () => {
  if (!process.env.JWT_SECRET) throw new EnvMissingException("JWT_SECRET");
  if (!process.env.MONGO_URI) throw new EnvMissingException("MONGO_URI");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Orders Service Connected to MongoDB");

    app.listen(3000, () => {
      console.log(`Orders Service is Listening on Port 3000`);
    });

    new TicketCreatedConsumer().listen();
    new TicketUpdatedConsumer().listen();
    new ExpirationCompleteConsumer().listen();
    new PaymentCreatedConsumer().listen();
  } catch (e) {
    console.error(e);
  }
};

start();
