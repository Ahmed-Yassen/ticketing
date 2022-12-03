import request from "supertest";
import app from "../../app";

it("responds with details about the current user", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Ahmed",
      lastName: "Yassen",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  let cookie = signupResponse.headers["set-cookie"];

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("returns a 401 if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(401);
});
