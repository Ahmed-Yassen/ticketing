import express from "express";
import { currentUserRouter } from "../routes/current-user";
import { signinRouter } from "../routes/signin";
import { signoutRouter } from "../routes/signout";
import { signupRouter } from "../routes/signup";

const app = express();
app.use(express.json());

app.use("/api/users", [
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
]);

app.listen(3000, () => {
  console.log(`Auth Service is Listening on Port 3000`);
});
