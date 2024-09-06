import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";

const signup = async ({
  email,
  password,
  username,
  avatarURL,
  verificationToken = uuidv4(),
}) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    avatarURL,
    verificationToken,
  });

  await newUser.save();
  return newUser;
};

const signin = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  if (!user.verify) {
    throw new Error("Email not verified");
  }

  const token = user.generateAuthToken();
  return { token, user };
};

const updateUser = async (filter, update) => {
  const user = await User.findOneAndUpdate(filter, update, { new: true });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const findUser = async (filter) => {
  return await User.findOne(filter);
};

export { signup, signin, updateUser, findUser };
