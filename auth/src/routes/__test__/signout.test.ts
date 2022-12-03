import request from "supertest";
import app from "../../app";
import {
  getAuthCookie,
  signupUser,
  testUser,
} from "../../test/helperFunctions";

it("clears the cookie after signing out", async () => {
  const signupResponse = await signupUser(testUser).expect(201);

  let cookie = getAuthCookie(signupResponse);
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
