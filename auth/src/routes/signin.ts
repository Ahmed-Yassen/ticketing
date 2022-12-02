import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestException } from "../errors/bad-request-exception";
import { validateRequest } from "../middlewares/validate-request";
import { User, UserAttributes } from "../models/user";
import { PasswordHandler } from "../utils/password-handler";
import { getCookieWithJwt } from "../utils/helperFunctions";
import passport from "passport";
import googleStrategy from "../utils/passport-strategies/google-strategy";

const router = Router();
passport.use(googleStrategy);

interface UserPayload extends UserAttributes {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

router.get("/login", (req, res) => {
  res.render("login");
});

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
  (req, res) => {
    req.currentUser = req.user as UserPayload;

    res.setHeader("Set-Cookie", getCookieWithJwt(req.currentUser.id));
    res.send(req.currentUser);
  }
);

export { router as signinRouter };
