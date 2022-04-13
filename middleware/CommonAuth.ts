import { Request, Response, NextFunction } from "express";
import { AuthPayLoad } from "../dto/Auth.dto";
import { ValidateSignture } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayLoad;
    }
  }
}
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignture(req);

  if (validate) {
    next();
  } else {
    return res.status(401).json({ message: "User is not Authorized" });
  }
};
