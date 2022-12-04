import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ayticketing/common";
import { body } from "express-validator";

const router = Router();

router.post(
  "/create",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage("Title should be valid"),
    body("price")
      .isFloat({ min: 1 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  (req: Request, res: Response) => {}
);

export { router as createTicketRouter };
