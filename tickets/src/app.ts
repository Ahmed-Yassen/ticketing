import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");
import { createTicketRouter } from "./routes/__test__/create-ticket";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/tickets", [createTicketRouter]);

app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

export default app;
