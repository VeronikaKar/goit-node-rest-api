import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  avatarURL: Joi.string().uri().optional(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
