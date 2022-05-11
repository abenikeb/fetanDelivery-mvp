import { NextFunction, Request, Response } from "express";

export const AdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.user_group !== 1) return res.status(403).send("Access Denied!");
  next();
};
