import request from "supertest";
import app from "../../app";

it("returns a 201 on a successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});

it("returns a 400 with empty body", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "12345678",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  expect(response.headers["set-cookie"]).toBeDefined();
});
