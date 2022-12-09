import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestException,
  NotFoundException,
  NotAuthorizedException,
  OrderStatus,
} from "@ayticketing/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedProduer } from "../events/producers/payment-created-producer";

const router = Router();

router.post(
  "/charge",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token must be provided"),
    body("orderId").isMongoId().withMessage("Order ID must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundException("Order");

    if (order.userId.toString() !== req.userId.toString())
      throw new NotAuthorizedException();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestException("Cannot pay for a cancelled order");

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, //- we need to convert the dollar value into cents
      source: token,
    });

    const payment = Payment.build({ orderId, stripeId: charge.id });
    await payment.save();

    new PaymentCreatedProduer().publish({ id: payment.id, orderId });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
