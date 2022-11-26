import express from "express";
import "express-async-errors";
import { currentUserRouter } from "../routes/current-user";
import { signinRouter } from "../routes/signin";
import { signoutRouter } from "../routes/signout";
import { signupRouter } from "../routes/signup";
import { NotFoundException } from "./errors/not-found-exception";
import { errorHandler } from "./middlewares/error-handler";

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

app.listen(3000, () => {
  console.log(`Auth Service is Listening on Port 3000`);
});
