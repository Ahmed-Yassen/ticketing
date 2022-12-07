import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookieWithJwt } from "../../test/setup";

it("fetches the user's order", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 50 });
  await ticket.save();

  const userCookie = getCookieWithJwt();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userCookie)
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns a 401 if the user doesnt own the order", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 50 });
  await ticket.save();

  const userCookie = getCookieWithJwt();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", getCookieWithJwt())
    .expect(401);
});
