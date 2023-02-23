import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { UserRequest } from "./jwtAuth";

export const adminOnlyMiddleware: RequestHandler = (
  req: UserRequest,
  res,
  next
) => {
  if (req.user!.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Not your zone to work"));
  }
};
