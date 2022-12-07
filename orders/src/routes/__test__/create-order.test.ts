import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { getCookieWithJwt } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 if the ticket doesn't exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookieWithJwt())
    .send({ ticketId })
    .expect(404);
});

it("returns a 400 if the ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 100 });
  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticketId: ticket.id,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookieWithJwt())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves the ticket", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 100 });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookieWithJwt())
    .send({ ticketId: ticket.id })
    .expect(201);
});
