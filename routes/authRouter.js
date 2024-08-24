import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  userSignupSchema,
  userSigninSchema,
  subscriptionSchema,
} from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const { Router } = express;

const signupMiddleware = validateBody(userSignupSchema);
const signinMiddleware = validateBody(userSigninSchema);

const authRouter = Router();

authRouter.post("/register", signupMiddleware, authControllers.signup);
authRouter.post("/login", signinMiddleware, authControllers.signin); 
authRouter.post("/logout", authenticate, authControllers.signout); 
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  authControllers.updateSubscription 
);

export default authRouter;
