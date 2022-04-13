import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";

import { validate } from "class-validator";

import {
  CreateProductInput,
  LoginVandor,
  UpdateVandor,
  UserType,
  UserPayload,
} from "../dto";
// import { Grocery, Vandor } from "../models";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <LoginVandor>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor != null) {
    const validation = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );
    if (validation) {
      const signture = GenerateSignature({
        id: existingVandor._id,
        email: existingVandor.email,
        name: existingVandor.name,
      });
      return res.json(signture);
    }
    return res.status(400).json("Failed in Autentication");
  } else {
    return res.status(400).json("User Does't Exist");
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVandor(user.id);
    return res.json(existingVendor);
  }
  return res.status(401).json({ message: "Access denied. No token provided." });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address_line1, address_line2, email, tel, password } =
    req.body as UpdateVandor;
  const user = req.user as UserPayload;
  if (user) {
    let existingVendor = await FindVandor(user.id);

    if (existingVendor != null) {
      existingVendor.name = name;
      existingVendor.address_line1 = address_line1;
      existingVendor.address_line2 = address_line2;
      existingVendor.email = email;
      existingVendor.tel = tel;
      existingVendor.password = password;

      const savedResult = await existingVendor.save();
      res.json(savedResult);
      return;
    } else {
      return res.status(400).json({ message: "The Vendor Couldn't Be Found." });
    }
  }
  return res.status(401).json({ message: "Access denied. No token provided." });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existingVandor = await FindVandor(user.id);
  if (!existingVandor)
    return res.status(400).json({ message: "Invalid Vendor!" });

  const files = req.files as [Express.Multer.File];
  const images = files.map((file: Express.Multer.File) => file.filename);
  existingVandor.coverImages.push(...images);

  await existingVandor.save();
  res.status(200).json({ result: existingVandor });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existingVandor = await FindVandor(user.id);
  if (!existingVandor)
    return res.status(400).json({ message: "Invalid Vendor!" });

  existingVandor.serviceAvailable = !existingVandor.serviceAvailable;

  const { lat, lng } = req.body as UserType;
  if (!(lat && lng))
    return res.status(400).json({
      message: "We were unable to locate the vendor's location.",
    });

  existingVandor.lat = lat;
  existingVandor.lng = lng;
};

export const AddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let vendor = await FindVandor(user.id);
  if (!vendor) return res.status(400).json({ message: "Invalid Vendor!" });

  const files = req.files as [Express.Multer.File];
  const images = files.map((file: Express.Multer.File) => file.filename);

  const CreateProductInputs = plainToClass(CreateProductInput, req.body);
  const CreateProductInputsError = await validate(CreateProductInputs, {
    validationError: { target: true },
  });
  if (CreateProductInputsError.length > 0)
    return res.json(CreateProductInputsError);

  const {
    name,
    desc,
    category_id,
    inventory_id,
    shipping_id,
    price,
    status,
    tag_id,
    vender_id,
    rating,
    modified_at,
  } = CreateProductInputs;
  const groceryCreate = await Grocery.create({
    vandorId: vendor._id,
    name: name,
    desc: desc,
    category_id: category_id,
    images: images,
    inventory_id: inventory_id,
  });

  vendor.grocery.push(groceryCreate);
  await vendor.save();
  res.json(vendor);
};

export const GetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const listProduct = await Grocery.find({ vandorId: user.id });
  if (!listProduct) return res.json({ Message: "No Product Found" });

  return res.json(listProduct);
};

// export const GetOrdersVandor = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;
//   if (user) {
//     const vandorOrder = await Order.find({ vandorID: user._id }).populate(
//       "items.grocery"
//     );
//     if (vandorOrder) {
//       return res.json(vandorOrder);
//     }
//   }
//   return res.status(400).json("No Order Found");
// };

export const GetOrdersDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate("items.grocery");

  if (!order)
    return res.status(404).send("The Order with the given ID was not found.");

  res.status(200).json(order);
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderStatus, remarks, readyTime } = req.body;

  let order = await Order.findById(req.params.id).populate("items.grocery");
  order.orderStatus = orderStatus;

  if (!order)
    return res
      .status(404)
      .json({ message: "The Order With the Given ID Was Not Found." });

  res.status(200).send(await order.save());
};
