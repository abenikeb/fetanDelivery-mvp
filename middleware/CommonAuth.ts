import { Request, Response, NextFunction } from "express";
import { AuthPayLoad, UserPayload } from "../dto";
import { ValidateSignture } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignture(req, res);

  if (validate) {
    next();
  } else {
    return res.status(400).json({ message: "User is not Authorized" });
  }
};
