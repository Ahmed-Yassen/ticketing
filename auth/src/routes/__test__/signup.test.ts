import request from "supertest";
import app from "../../app";
import {
  getAuthCookie,
  signupUser,
  testUser,
} from "../../test/helperFunctions";

it("returns a 201 on a successfull signup", async () => {
  return signupUser(testUser).expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return signupUser({ ...testUser, email: "invalidEmail" }).expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return signupUser({ ...testUser, password: "1" }).expect(400);
});

it("returns a 400 with empty body", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await signupUser(testUser).expect(201);
  await signupUser(testUser).expect(400);
});

it("sets a cookie after successful signup", async () => {
  const signupResponse = await signupUser(testUser).expect(201);
  const cookie = getAuthCookie(signupResponse);
  expect(cookie).toBeDefined();
});
