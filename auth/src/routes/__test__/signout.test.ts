import request from "supertest";
import app from "../../app";

it("clears the cookie after signing out", async () => {
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
    .post("/api/users/signout")
    .set("Cookie", cookie)
    .send({})
    .expect(200);
  cookie = response.headers["set-cookie"][0];
  expect(cookie).toBe(
    "Authentication=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
});
