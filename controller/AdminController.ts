import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
// import { DeliveryUser, Transaction, Vandor } from "../models";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateOtp,
  GenerateSignature,
} from "../utility";

export const FindVandor = (id: number | string | undefined, email?: string) => {
  if (email) return Vandor.findOne({ email: email });
  else return Vandor.findById(id);
};

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorInput = plainToClass(CreateVendorInput, req.body);
  const vendorInputErrors = await validate(vendorInput, {
    validationError: { target: true },
  });
  if (vendorInputErrors.length > 0) {
    return res.status(400).json(vendorInputErrors);
  }

  const {
    name,
    email,
    owner_id,
    password,
    tel,
    address_line1,
    address_line2,
    city,
    lat,
    lng,
    user_group,
  } = vendorInput;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const existVendor = await User.findOne({ tel: tel });
  if (existVendor)
    return res.status(400).json({ message: "User already registered." });

  const result = await User.create({
    name: name,
    tel: tel,
    password: userPassword,
    salt: salt,
    email: email,
    oto: otp,
    otp_expiry: expiry,
    address_line1: address_line1,
    address_line2: address_line2,
    city: city,
    lat: lat,
    lng: lng,
    user_group: user_group,
  });

  if (!result) return res.json({ message: "Not found" });

  //generate signture
  const signture = GenerateSignature({
    id: result.id,
    email: result.email,
    name: result.name,
  });

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      otp: otp,
      name: result.name,
      email: result.email,
    });
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = await Vandor.find();
  if (!vendor) return res.status(404).json("Message: Vendor does not exist");
  return res.json(vendor);
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandor = await FindVandor(req.params.id);
  if (vandor != null) return res.status(200).json(vandor);
  return res.status(404).json({ Message: "With this id, there is no vendor." });
};

export const GetTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Transaction.find();
  transaction
    ? res.json(transaction)
    : res.json({ Message: "There is no such transaction ID." });
};

export const GetTransactionByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Transaction.findById(req.params.id);
  transaction
    ? res.json(transaction)
    : res.status(404).json({ Message: "There is no such transaction ID." });
};

export const GetDeliveryBoys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryBoys = await DeliveryUser.find();
  return deliveryBoys
    ? res.json(deliveryBoys)
    : res.json({ message: "Unable to find Delivery Boys!" });
};

export const VerifyDeliveryBoys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryBoys = await DeliveryUser.findById(req.params.id);
  if (deliveryBoys) {
    deliveryBoys.verified = !deliveryBoys.verified;
    const result = await deliveryBoys.save();
    result ? res.json(result) : res.json("Unable to result!");
  }
};
