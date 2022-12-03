import request, { Response } from "supertest";
import app from "../app";
import { UserAttributes } from "../models/user";

const signupUser = (user: UserAttributes) => {
  return request(app).post("/api/users/signup").send(user);
};

const signinUser = (credentials: { email: string; password: string }) => {
  return request(app).post("/api/users/signin").send(credentials);
};

const getAuthCookie = (response: Response) => {
  return response.headers["set-cookie"];
};

const testUser = {
  firstName: "Ahmed",
  lastName: "Yassen",
  email: "test@test.com",
  password: "password",
};

export { signinUser, signupUser, getAuthCookie, testUser };
