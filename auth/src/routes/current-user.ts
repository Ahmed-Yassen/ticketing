import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
const router = Router();

interface UserPayload extends JwtPayload {
  id: number;
}

router.get("/currentuser", async (req, res) => {
  const token = req.cookies.Authentication;
  if (!token) return res.send({ currentUser: null });

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return res.send({ currentUser: null });
  }

  const { id } = decodedToken as UserPayload;
  const user = await User.findById(id);

  res.send({ currentUser: user });
});

export { router as currentUserRouter };
