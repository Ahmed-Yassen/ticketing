import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;

jest.mock("../../node_modules/@ayticketing/common/build/events/producer.js");

beforeAll(async () => {
  process.env.JWT_SECRET = "TestsJwtSecret";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

const getCookieWithJwt = () => {
  const token = jwt.sign(
    { id: new mongoose.Types.ObjectId() },
    process.env.JWT_SECRET!
  );
  return `Authentication=${token}; HttpOnly; Path=/;`;
};

export { getCookieWithJwt };
