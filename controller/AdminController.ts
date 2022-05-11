import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import _ from "lodash";

import { CreateVendorInput, VendorType } from "../dto";
import { Vendor } from "../model";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateOtp,
  GenerateSignature,
} from "../utility";

export const FindVendor = (id: number, email?: string) => {
  if (email) return Vendor.findOne({ email: email });
  else return Vendor.findById({ id: id });
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorInput = plainToClass(CreateVendorInput, req.body);
  const vendorInputErrors = await validate(vendorInput, {
    validationError: { target: true },
  });
  if (vendorInputErrors.length > 0) {
    return res
      .status(400)
      .json(_.map(vendorInputErrors, (error) => error.constraints));
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
  } = vendorInput;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const existVendor = await Vendor.findOne({ email: email });
  if (existVendor.rows.length > 0)
    return res.status(400).json({ message: "User already registered." });

  const vendor = await new Vendor({
    name: name,
    email: email,
    owner_id: owner_id,
    password: userPassword,
    tel: tel,
    salt: salt,
    service_available: false,
    address_line1: address_line1,
    address_line2: address_line2,
    city: city,
    lat: 0,
    lng: 0,
    rating: 0,
    modified_at: new Date(),
  } as any);

  const result = await vendor.create();
  if (!result) return res.json({ message: "Error found" });

  // generate signture
  const signture = GenerateSignature({
    id: result.rows[0].id,
    email: result.rows[0].email,
    name: result.rows[0].name,
  });

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      otp: otp,
      name: result.rows[0].name,
      email: result.rows[0].email,
    });
};

// export const GetVendors = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const vendor = await Vandor.find();
//   if (!vendor) return res.status(404).json("Message: Vendor does not exist");
//   return res.json(vendor);
// };

// export const GetVendorByID = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const vandor = await FindVandor(req.params.id);
//   if (vandor != null) return res.status(200).json(vandor);
//   return res.status(404).json({ Message: "With this id, there is no vendor." });
// };

// export const GetTransaction = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const transaction = await Transaction.find();
//   transaction
//     ? res.json(transaction)
//     : res.json({ Message: "There is no such transaction ID." });
// };

// export const GetTransactionByID = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const transaction = await Transaction.findById(req.params.id);
//   transaction
//     ? res.json(transaction)
//     : res.status(404).json({ Message: "There is no such transaction ID." });
// };

// export const GetDeliveryBoys = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const deliveryBoys = await DeliveryUser.find();
//   return deliveryBoys
//     ? res.json(deliveryBoys)
//     : res.json({ message: "Unable to find Delivery Boys!" });
// };

// export const VerifyDeliveryBoys = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const deliveryBoys = await DeliveryUser.findById(req.params.id);
//   if (deliveryBoys) {
//     deliveryBoys.verified = !deliveryBoys.verified;
//     const result = await deliveryBoys.save();
//     result ? res.json(result) : res.json("Unable to result!");
//   }
// };
