require("dotenv").config();
import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayLoad } from "../dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: AuthPayLoad) => {
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY as string);
};

export const ValidateSignture = async (req: Request) => {
  const signture = req.get("Authorization");

  if (signture) {
    const payload = (await jwt.verify(
      signture.split(" ")[1],
      process.env.JWT_PRIVATE_KEY as string
    )) as AuthPayLoad;
    req.user = payload;
    return true;
  }
  return false;
};
