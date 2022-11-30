import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestException } from "../errors/bad-request-exception";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";
import { getCookieWithJwt } from "../utils/helperFunctions";

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestException("Email already registered");

    const { firstName, lastName, password } = req.body;
    const user = User.build({ firstName, lastName, email, password });
    await user.save();

    res.setHeader("Set-Cookie", getCookieWithJwt(user.id));
    res.status(201).send(user);
  }
);

export { router as signupRouter };
