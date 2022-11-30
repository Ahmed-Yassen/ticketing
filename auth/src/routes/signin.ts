import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestException } from "../errors/bad-request-exception";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { PasswordHandler } from "../utils/password-handler";
import { getCookieWithJwt } from "../utils/helperFunctions";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestException("Invalid Credentials");

    const passwordsMatch = PasswordHandler.compare(password, user.password);
    if (!passwordsMatch) throw new BadRequestException("Invalid Credentials");

    res.setHeader("Set-Cookie", getCookieWithJwt(user.id));
    res.send(user);
  }
);
export { router as signinRouter };
