import FacebookStrategy from "passport-facebook";
import { EnvMissingException, BadRequestException } from "@ayticketing/common";
import { User } from "../../models/user";

if (!process.env.FACEBOOK_CLIENT_ID)
  throw new EnvMissingException("FACEBOOK_CLIENT_ID");
if (!process.env.FACEBOOK_CLIENT_SECRET)
  throw new EnvMissingException("FACEBOOK_CLIENT_SECRET");

export default new FacebookStrategy.Strategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/api/users/facebook/redirect",
  },
  async (accessToken, refreshToken, profile, done) => {
    const facebookId = +profile.id;
    const registeredUser = await User.findOne({ facebookId });

    if (registeredUser) return done(null, registeredUser);

    const { email, first_name: firstName, last_name: lastName } = profile._json;

    if (!firstName || !lastName) {
      throw new BadRequestException("No firstName or lastName");
    }

    const createdUser = User.build({ firstName, lastName, email, facebookId });
    await createdUser.save();
    return done(null, createdUser);
  }
);
