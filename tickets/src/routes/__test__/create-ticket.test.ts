import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookieWithJwt } from "../../test/setup";

it("can only be accessed if the user is logged in", async () => {
  await request(app).post("/api/tickets/create").send({}).expect(401);
});

it("returns a 400 if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", getCookieWithJwt())
    .send({ title: "", price: 10 })
    .expect(400);
});

it("returns a 400 if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", getCookieWithJwt())
    .send({ title: "Valid Title", price: -10 })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toBe(0);

  const testingTicket = { title: "Testing Ticket", price: 50 };

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", getCookieWithJwt())
    .send(testingTicket)
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toBe(1);
  expect(tickets[0]).toMatchObject(testingTicket);
});
