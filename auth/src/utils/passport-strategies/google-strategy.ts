import GoogleStartegy from "passport-google-oauth20";
import { EnvMissingException, BadRequestException } from "@ayticketing/common";
import { User } from "../../models/user";

if (process.env.NODE_ENV !== "test" && !process.env.GOOGLE_CLIENT_ID)
  throw new EnvMissingException("GOOGLE_CLIENT_ID");
if (process.env.NODE_ENV !== "test" && !process.env.GOOGLE_CLIENT_SECRET)
  throw new EnvMissingException("GOOGLE_CLIENT_SECRET");

export default new GoogleStartegy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "TestClientID",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "TestClientSecret",
    callbackURL: "/api/users/google/redirect",
  },
  async (accessToken, refreshToken, profile, done) => {
    const googleId = +profile.id;
    const registeredUser = await User.findOne({ googleId });
    if (registeredUser) return done(null, registeredUser);

    const {
      email,
      given_name: firstName,
      family_name: lastName,
    } = profile._json;

    if (!firstName || !lastName) {
      throw new BadRequestException("No firstName or lastName");
    }
    let createdUser = User.build({ firstName, lastName, email, googleId });
    await createdUser.save();
    return done(null, createdUser);
  }
);
