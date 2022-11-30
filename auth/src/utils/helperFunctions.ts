import jwt from "jsonwebtoken";

const getCookieWithJwt = (userId: number) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!);
  return `Authentication=${token}; HttpOnly; Path=/;`;
};

export { getCookieWithJwt };
