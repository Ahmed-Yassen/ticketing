import { PaymentCreatedEvent, Producer, Topics } from "@ayticketing/common";

export class PaymentCreatedProduer extends Producer<PaymentCreatedEvent> {
  topic: Topics.PaymentCreated = Topics.PaymentCreated;
}
