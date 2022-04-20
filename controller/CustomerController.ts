// import express, { Request, Response, NextFunction } from "express";
// import { Vandor } from "../models";
// import { Offer } from "../models/Offer";

// export const GetGroceryAvailablity = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let pinCode = req.params.pinCode;

//   const result = await Vandor.find({
//     pincode: pinCode,
//     serviceAvailable: false,
//   })
//     .sort([["rating", "descending"]])
//     .populate("grocery");

//   if (result.length > 0) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(400).json({ Message: "Data not found" });
//   }
// };

// export const TopSupermarkets = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let pinCode = req.params.pinCode;

//   const result = await Vandor.find({
//     pincode: pinCode,
//     serviceAvailable: false,
//   })
//     .sort([["rating", "descending"]])
//     .limit(2);

//   if (result.length > 0) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(400).json({ Message: "Data not found" });
//   }
// };

// export const SeachProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let pinCode = req.params.pinCode;

//   const result = await Vandor.find({
//     pincode: pinCode,
//     serviceAvailable: true,
//   })
//     .sort([["descending"]])
//     .populate("grocery");

//   if (result.length > 0) {
//     let groceryResult: any = [];
//     result.map((item) => groceryResult.push(...item.grocery));
//     return res.status(200).json(groceryResult);
//   } else {
//     return res.status(400).json({ Message: "Data not found" });
//   }
// };
// export const GetSuperMarketByID = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let id = req.params.id;

//   const result = await Vandor.findById({ id: id });
//   if (!result)
//     return res.status(404).send("The vendor with the given ID was not found!");

//   res.status(200).json(result);
// };
