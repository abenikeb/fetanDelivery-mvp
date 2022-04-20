// import { plainToClass } from "class-transformer";
// import { Request, Response, NextFunction } from "express";
// import {
//   CreateDeliveryUserInput,
//   CreateDeliveryUserLogin,
//   CreateUserLogin,
// } from "../dto";
// import { validate } from "class-validator";
// import {
//   GeneratePassword,
//   GenerateSalt,
//   GenerateSignature,
//   ValidatePassword,
// } from "./../utility/PasswordUnility";
// import { DeliveryUser } from "../models";

// export const DeliveryUserService = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const deliveryBoy = req.user;
//   const { lat, lng } = req.body;
//   if (!deliveryBoy) return;

//   let services = await DeliveryUser.findById(deliveryBoy._id);
//   if (!services) return;

//   services.isAvalaible = !services.isAvalaible;
//   services.lat = lat;
//   services.lng = lng;

//   const result = await services.save();
//   result ? res.json(result) : res.json("Error");
// };

// export const GetDeliveryUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// export const EditDeliveryUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
