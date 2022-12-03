import request from "supertest";
import app from "../../app";
import {
  getAuthCookie,
  signupUser,
  testUser,
} from "../../test/helperFunctions";

it("responds with details about the current user", async () => {
  const signupResponse = await signupUser(testUser);
  const cookie = getAuthCookie(signupResponse);
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("returns a 401 if not authenticated", async () => {
  await request(app).get("/api/users/currentuser").send().expect(401);
});
