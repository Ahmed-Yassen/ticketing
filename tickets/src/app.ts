import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");
import { createTicketRouter } from "./routes/create-ticket";
import { getTicketById } from "./routes/get-ticket-by-id";
import { getTicketsRouter } from "./routes/get-tickets";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/tickets", [createTicketRouter, getTicketById, getTicketsRouter]);

app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

export default app;
