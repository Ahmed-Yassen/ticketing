import request from "supertest";
import app from "../../app";
import { Order } from "../../models/order";
import { Ticket, TicketAttributes } from "../../models/ticket";
import { getCookieWithJwt } from "../../test/setup";

const createTicket = async (ticketAttrs: TicketAttributes) => {
  const ticket = Ticket.build(ticketAttrs);
  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  //- Create 3 Tickets
  const tickets = [];
  for (let i = 1; i <= 3; i++) {
    const ticket = await createTicket({ title: `Ticket #${i}`, price: i * 10 });
    tickets.push(ticket);
  }

  //- Create an order as UserOne
  const userOneCookie = getCookieWithJwt();
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOneCookie)
    .send({ ticketId: tickets[0].id })
    .expect(201);

  //- Create two orders as UserTwo
  const userTwoCookie = getCookieWithJwt();
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoCookie)
    .send({ ticketId: tickets[1].id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoCookie)
    .send({ ticketId: tickets[2].id })
    .expect(201);

  //- Get userTwo Orders
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwoCookie)
    .expect(200);

  expect(response.body.length).toBe(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
