import bcrypt from "bcryptjs";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const signup = async ({ email, password, username, avatarURL }) => {
  const existingUser = await findUser({ email });
  if (existingUser) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashPassword,
    username,
    avatarURL,
    subscription: "starter",
  });

  return newUser;
};

export const signin = async ({ email, password }) => {
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = createToken(payload);

  await updateUser({ _id: user._id }, { token });

  return { token, user };
};
