import mongoose from "mongoose";
import { PasswordHandler } from "../utils/password-handler";

export interface UserAttributes {
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  googleId?: number;
}

interface UserDocument extends mongoose.Document, UserAttributes {}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: Number,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.password && user.isModified("password"))
    user.password = await PasswordHandler.hash(user.password);

  next();
});

userSchema.statics.build = (userAttrs: UserAttributes) => {
  return new User(userAttrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
