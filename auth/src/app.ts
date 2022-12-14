import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

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

export default app;
