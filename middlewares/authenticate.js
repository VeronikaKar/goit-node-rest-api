import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

const authenticate = async (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(HttpError(401, "Invalid authorization format"));
  }

  const { data, error } = verifyToken(token);
  if (error) {
    return next(HttpError(401, error.message));
  }

  const { id } = data;
  const user = await findUser({ _id: id });
  if (!user) {
    return next(HttpError(401, "User not found"));
  }

  if (!user.token) {
    return next(HttpError(401, "User already logged out"));
  }

  req.user = user;
  next();
};

export default authenticate;
