import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import { userSignupSchema, userSigninSchema } from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const signupMiddleware = validateBody(userSignupSchema);
const signinMiddleware = validateBody(userSigninSchema);

const authRouter = Router();

authRouter.post("/register", signupMiddleware, authControllers.register);
authRouter.post("/login", signinMiddleware, authControllers.login);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  authControllers.updateSubscription
);

export default authRouter;
