import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";

new OrderCreatedConsumer().listen();
