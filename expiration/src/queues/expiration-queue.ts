import Queue from "bull";
import { Types } from "mongoose";
import { ExpirationCompleteProducer } from "../events/producers/expiration-complete-producer";

interface Payload {
  orderId: Types.ObjectId;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompleteProducer().publish({ orderId: job.data.orderId });
});

export { expirationQueue };
