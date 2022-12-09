import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");
import { createChargeRouter } from "./routes/create-charge";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/payments", [createChargeRouter]);

app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

export default app;
