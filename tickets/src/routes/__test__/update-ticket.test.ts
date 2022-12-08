import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { getCookieWithJwt } from "../../test/setup";
import jwt from "jsonwebtoken";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id doesn't exist", async () => {
  await request(app)
    .put(`/api/tickets/update/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", getCookieWithJwt())
    .send({ title: "New Title" })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/update/${new mongoose.Types.ObjectId()}`)
    .send({ title: "New Title" })
    .expect(401);
});

it("returns a 401 if the user doesnt own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", getCookieWithJwt())
    .send({ title: "Testing Ticket", price: 50 })
    .expect(201);

  const ticketId = response.body.id;

  const token = jwt.sign(
    { id: new mongoose.Types.ObjectId() },
    process.env.JWT_SECRET!
  );

  await request(app)
    .put(`/api/tickets/update/${ticketId}`)
    .set("Cookie", `Authentication=${token}; HttpOnly; Path=/;`)
    .send({ title: "New Title" })
    .expect(401);
});

it("returns a 400 if the user provides invalid title or price", async () => {
  const userCookie = getCookieWithJwt();

  const response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", userCookie)
    .send({ title: "Testing Ticket", price: 50 })
    .expect(201);

  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/update/$${ticketId}`)
    .set("Cookie", userCookie)
    .send({ title: "" })
    .expect(400);

  await request(app)
    .put(`/api/tickets/update/$${ticketId}`)
    .set("Cookie", userCookie)
    .send({ price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const userCookie = getCookieWithJwt();

  let response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", userCookie)
    .send({ title: "Testing Ticket", price: 50 })
    .expect(201);

  const ticketId = response.body.id;

  response = await request(app)
    .put(`/api/tickets/update/${ticketId}`)
    .set("Cookie", userCookie)
    .send({ price: 75 })
    .expect(200);

  expect(response.body.title).toBe("Testing Ticket");
  expect(response.body.price).toBe(75);
});

it("returns a 400 if the ticket is already reserved", async () => {
  const userCookie = getCookieWithJwt();

  const { body } = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", userCookie)
    .send({ title: "Testing Ticket", price: 50 })
    .expect(201);

  const ticket = await Ticket.findById(body.id);
  ticket!.orderId = new mongoose.Types.ObjectId();
  await ticket!.save();

  const response = await request(app)
    .put(`/api/tickets/update/${ticket!.id}`)
    .set("Cookie", userCookie)
    .send({ price: 500 })
    .expect(400);
});
