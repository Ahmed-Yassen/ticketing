import { OrderStatus } from "@ayticketing/common";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookieWithJwt } from "../../test/setup";

it("cancels an order", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 50 });
  await ticket.save();

  const userCookie = getCookieWithJwt();
  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: canceledOrder } = await request(app)
    .patch(`/api/orders/${createdOrder.id}`)
    .set("Cookie", userCookie)
    .expect(200);

  expect(canceledOrder.id).toEqual(createdOrder.id);
  expect(canceledOrder.status).toBe(OrderStatus.Cancelled);
});
