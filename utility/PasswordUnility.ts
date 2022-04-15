require("dotenv").config();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayLoad } from "../dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password?: string, salt?: string) => {
  return await bcrypt.hash(password as string, salt as string);
};

export const ValidatePassword = async (
  enteredPassword?: string,
  savedPassword?: string,
  salt?: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: AuthPayLoad) => {
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY as string);
};

export const ValidateSignture = async (req: Request, res: Response) => {
  const token = req.get("Authorization");
  // if (!token) return res.status(401).send("Access Denaid");
  if (!token) return false;

  try {
    const payload = (await jwt.verify(
      token.split(" ")[1],
      process.env.JWT_PRIVATE_KEY as string
    )) as AuthPayLoad;

    req.user = payload;
    return true;
  } catch (error) {
    return false;
  }
};
