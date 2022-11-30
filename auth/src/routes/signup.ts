import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestException } from "../errors/bad-request-exception";
import { RequestValidationException } from "../errors/request-validation-exception";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationException(errors.array());

    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestException("Email already registered");

    const { firstName, lastName, password } = req.body;
    const user = User.build({ firstName, lastName, email, password });
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    const cookie = `Authentication=${token}; HttpOnly; Path=/;`;
    res.setHeader("Set-Cookie", cookie);

    res.send(user);
  }
);

export { router as signupRouter };
