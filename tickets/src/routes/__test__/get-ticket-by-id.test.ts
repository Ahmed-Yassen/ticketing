import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { getCookieWithJwt } from "../../test/setup";

it("returns a 400 when providing an invalid ticket id", async () => {
  await request(app).get("/api/tickets/455151asdasdf").send().expect(400);
});

it("returns a 404 when the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId()}`)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const testingTicket = { title: "Testing Ticket", price: 50 };

  let response = await request(app)
    .post("/api/tickets/create")
    .set("Cookie", getCookieWithJwt())
    .send(testingTicket)
    .expect(201);

  const ticketId = response.body.id;

  response = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .set("Cookie", getCookieWithJwt())
    .send(testingTicket)
    .expect(200);

  expect(response.body).toMatchObject(testingTicket);
});
