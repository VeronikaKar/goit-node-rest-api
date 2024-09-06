import path from "path";
import { fileURLToPath } from "url";
import gravatar from "gravatar";
import HttpError from "../helpers/HttpError.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import { sendVerificationEmail } from "../services/brevoClient.js";
import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import Jimp from "jimp";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsPath = path.join(__dirname, "../public/avatars");

const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);
    const verificationToken = uuidv4();

    const newUser = await authServices.signup({
      email,
      password,
      username,
      avatarURL,
      verificationToken,
    });

    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/users/verify/${verificationToken}`;

    await sendVerificationEmail(email, verificationLink);

    return res
      .status(201)
      .json({ message: "User created. Please verify your email." });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);

  const newUser = await authServices.signup({
    email,
    password,
    username,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const signin = async (req, res) => {
  const { token, user } = await authServices.signin(req.body);
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: null });
  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await authServices.updateUser({ _id }, { subscription });

  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { file } = req;
  const { _id } = req.user;

  if (!file) {
    throw HttpError(400, "No file uploaded");
  }

  try {
    const image = await Jimp.read(file.path);
    image.resize(250, 250);
    await image.writeAsync(file.path);

    const newFilename = `${Date.now()}_${file.originalname}`;
    const newFilePath = path.join(avatarsPath, newFilename);

    await fs.rename(file.path, newFilePath);

    const avatarURL = path.join("avatars", newFilename);
    const updatedUser = await authServices.updateUser({ _id }, { avatarURL });

    res.json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    throw HttpError(500, "Error processing the file");
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }

  const verificationToken = user.verificationToken;
  const verificationLink = `${process.env.APP_URL}/users/verify/${verificationToken}`;

  await sendVerificationEmail(email, verificationLink);

  res.status(200).json({ message: "Verification email sent" });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  verifyEmail: ctrlWrapper(verifyEmail),
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, 'secretKey');

//     res.status(200).json({
//         token,
//         user: {
//             email: user.email,
//             subscription: user.subscription
//         }
//     });
// };
