import mongoose from "mongoose";
import { EnvMissingException } from "@ayticketing/common";
import app from "./app";

const start = async () => {
  if (!process.env.JWT_SECRET) throw new EnvMissingException("JWT_SECRET");
  if (!process.env.MONGO_URI) throw new EnvMissingException("MONGO_URI");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Tickets Service Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Tickets Service is Listening on Port 3000`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
