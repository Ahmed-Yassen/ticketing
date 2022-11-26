import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

const router = Router();

router.post(
  "/signup",
  [
    body("firstName")
      .isString()
      .withMessage("First name must be valid")
      .toLowerCase(),
    body("lastName")
      .isString()
      .withMessage("Last name must be valid")
      .toLowerCase(),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).send(erros.array());
  }
);

export { router as signupRouter };
