import request from "supertest";
import app from "../../app";

it("Fails when an email that doesnt exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "sjdnglajsndghk" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);

  expect(response.headers["set-cookie"]).toBeDefined();
});
