import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestException } from "@ayticketing/common";
import { User } from "../models/user";
import { PasswordHandler } from "../utils/password-handler";
import { getCookieWithJwt } from "../utils/helperFunctions";
import passport from "passport";
import googleStrategy from "../utils/passport-strategies/google-strategy";
import facebookStrategy from "../utils/passport-strategies/facebook-strategy";
import { strategyController } from "../utils/passport-strategies/strategy-controller";

const router = Router();
passport.use(googleStrategy);
passport.use(facebookStrategy);

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

    const passwordsMatch = await PasswordHandler.compare(
      password,
      user.password!
    );
    if (!passwordsMatch) throw new BadRequestException("Invalid Credentials");

    res.setHeader("Set-Cookie", getCookieWithJwt(user.id));
    res.send(user);
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  strategyController
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { session: false }),
  strategyController
);

export { router as signinRouter };
