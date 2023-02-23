import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { UserRequest } from "./jwtAuth";

export const hostOnlyMiddleware: RequestHandler = async (
  req: UserRequest,
  res,
  next
) => {
  if (req.user!.role === "host") {
    next();
  } else {
    next(createHttpError(403, "Not your zone to work"));
  }
};
