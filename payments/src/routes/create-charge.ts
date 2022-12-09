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

    res.send("Yeppie");
  }
);

export { router as createChargeRouter };
