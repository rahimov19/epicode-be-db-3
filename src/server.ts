import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  notYourZoneHandler,
  unAuthorizedHandler,
} from "./errorHandlers";
import usersRouter from "./api/users/index";
import accomodationsRouter from "./api/accomodations/index";

export const server = express();
const port = process.env.port;

server.use(cors());
server.use(express.json());

server.use("/accomodations", accomodationsRouter);
server.use("/users", usersRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(notYourZoneHandler);
server.use(genericErrorHandler);
server.use(unAuthorizedHandler);
