import { Producer, ExpirationCompleteEvent, Topics } from "@ayticketing/common";

export class ExpirationCompleteProducer extends Producer<ExpirationCompleteEvent> {
  topic: Topics.ExpirationComplete = Topics.ExpirationComplete;
}
