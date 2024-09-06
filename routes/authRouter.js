import express from "express";
import multer from "multer";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  userSignupSchema,
  userSigninSchema,
  subscriptionSchema,
  resendVerificationEmailSchema,
} from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const { Router } = express;
const authRouter = Router();

const upload = multer({ dest: "tmp/" });

const signupMiddleware = validateBody(userSignupSchema);
const signinMiddleware = validateBody(userSigninSchema);
const subscriptionMiddleware = validateBody(subscriptionSchema);
const resendVerificationEmailMiddleware = validateBody(
  resendVerificationEmailSchema
);

authRouter.post("/register", signupMiddleware, authControllers.registerUser);

authRouter.post("/login", signinMiddleware, authControllers.signin);

authRouter.post("/logout", authenticate, authControllers.signout);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.patch(
  "/subscription",
  authenticate,
  subscriptionMiddleware,
  authControllers.updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

authRouter.post(
  "/resend-verification",
  resendVerificationEmailMiddleware,
  authControllers.resendVerificationEmail
);

authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);

export default authRouter;
