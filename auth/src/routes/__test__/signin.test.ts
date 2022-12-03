import request from "supertest";
import app from "../../app";
import { signinUser, signupUser, testUser } from "../../test/helperFunctions";

it("Fails when an email that doesnt exist is supplied", async () => {
  await signinUser({
    email: "test@test.com",
    password: "password",
  }).expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await signupUser(testUser).expect(201);

  let { email, password } = testUser;
  password = password + "NOW ITS NOT CORRECT";

  await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await signupUser(testUser).expect(201);

  const { email, password } = testUser;
  const signinResponse = await signinUser({ email, password }).expect(200);

  expect(signinResponse.headers["set-cookie"]).toBeDefined();
});
