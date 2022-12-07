import {
  NotAuthorizedException,
  NotFoundException,
  requireAuth,
  validateRequest,
} from "@ayticketing/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { Order } from "../models/order";

const router = Router();

router.get(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Order ID must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticketId");
    if (!order) throw new NotFoundException("Order");

    if (order.userId.toString() !== req.userId.toString())
      throw new NotAuthorizedException();

    res.send(order);
  }
);

export { router as getOrderById };
