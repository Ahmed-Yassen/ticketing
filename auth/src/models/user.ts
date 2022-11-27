import mongoose from "mongoose";

interface UserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserDocument extends mongoose.Document, UserAttributes {}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema({
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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (userAttrs: UserAttributes) => {
  return new User(userAttrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
