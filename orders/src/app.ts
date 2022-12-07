import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundException } from "@ayticketing/common";
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());



app.all("*", () => {
  throw new NotFoundException("URL");
});

app.use(errorHandler);

export default app;
