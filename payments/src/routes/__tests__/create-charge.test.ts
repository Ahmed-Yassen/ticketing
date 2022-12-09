import { OrderStatus } from "@ayticketing/common";
import { Types } from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order } from "../../models/order";
import { getCookieWithJwt } from "../../test/setup";

it("returns a 404 when purchasing an order that doesnt exist", async () => {
  await request(app)
    .post("/api/payments/charge")
    .set("Cookie", getCookieWithJwt())
    .send({
      token: "someImaginaryToken",
      orderId: new Types.ObjectId(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    price: 25,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments/charge")
    .set("Cookie", getCookieWithJwt())
    .send({
      token: "someImaginaryToken",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new Types.ObjectId();

  const order = Order.build({
    id: new Types.ObjectId(),
    userId,
    price: 25,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments/charge")
    .set("Cookie", getCookieWithJwt(userId))
    .send({
      token: "someImaginaryToken",
      orderId: order.id,
    })
    .expect(400);
});
