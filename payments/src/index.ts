import mongoose from "mongoose";
import { EnvMissingException } from "@ayticketing/common";
import app from "./app";
import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";
import { OrderCancelledConsumer } from "./events/consumers/order-cancelled-consumer";

const start = async () => {
  if (!process.env.JWT_SECRET) throw new EnvMissingException("JWT_SECRET");
  if (!process.env.MONGO_URI) throw new EnvMissingException("MONGO_URI");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Payments Service Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Payments Service is Listening on Port 3000`);
    });

    new OrderCreatedConsumer().listen();
    new OrderCancelledConsumer().listen();
  } catch (e) {
    console.error(e);
  }
};

start();
