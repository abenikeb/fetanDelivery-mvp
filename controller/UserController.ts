import { Request, Response } from "express";
import { User } from "../model/UserModel";

export const UserController = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body as User;
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
  const result = await user.save();
  res.send(result);
};
