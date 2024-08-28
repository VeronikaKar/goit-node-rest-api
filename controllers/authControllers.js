import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const tmpPath = path.resolve("tmp");
const avatarsPath = path.resolve("public", "avatars");


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

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
