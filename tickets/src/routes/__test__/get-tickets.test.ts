import request from "supertest";
import app from "../../app";
import { getCookieWithJwt } from "../../test/setup";

it("fetches a list of tickets", async () => {
  for (let i = 1; i <= 5; i++) {
    await request(app)
      .post("/api/tickets/create")
      .set("Cookie", getCookieWithJwt())
      .send({ title: `Ticket Number ${i}`, price: i * 10 })
      .expect(201);
  }

  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toBe(5);
});
