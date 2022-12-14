import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");
import { getOrderById } from "./routes/get-order-by-id";
import { getOrders } from "./routes/get-orders";
import { createOrder } from "./routes/create-order";
import { cancelOrder } from "./routes/cancel-order";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/orders", [getOrderById, getOrders, createOrder, cancelOrder]);

app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

export default app;
