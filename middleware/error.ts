import { NextFunction, Response, Request } from "express";

const winston = require("winston");

export const error = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  winston.error(err.message, err);
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed.");
};
