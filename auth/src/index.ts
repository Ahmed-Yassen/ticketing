import express from "express";
import "express-async-errors";
import { currentUserRouter } from "../routes/current-user";
import { signinRouter } from "../routes/signin";
import { signoutRouter } from "../routes/signout";
import { signupRouter } from "../routes/signup";
import { NotFoundException } from "./errors/not-found-exception";
import { errorHandler } from "./middlewares/error-handler";
import mongoose, { mongo } from "mongoose";

const app = express();
app.use(express.json());

app.use("/api/users", [
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
]);

app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Auth Service Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Auth Service is Listening on Port 3000`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
