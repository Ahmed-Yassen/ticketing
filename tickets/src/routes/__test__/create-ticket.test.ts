import request from "supertest";
import app from "../../app";
import { getCookieWithJwt } from "../../test/setup";

it("can only be accessed if the user is logged in", async () => {
  await request(app).post("/api/tickets/create").send({}).expect(401);
});

it("returns an error if an invalid title is provided", async () => {});

it("returns an error if an invalid price is provided", async () => {});

it("creates a ticket with valid inputs", async () => {});
