import {
  NotAuthorizedException,
  NotFoundException,
  requireAuth,
  validateRequest,
} from "@ayticketing/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { Order, OrderStatus } from "../models/order";

const router = Router();

router.patch(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Order ID must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundException("Order");

    if (order.userId.toString() !== req.userId.toString())
      throw new NotAuthorizedException();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  }
);

export { router as cancelOrder };
