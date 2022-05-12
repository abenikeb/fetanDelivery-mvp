import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { maxLength, validate } from "class-validator";

import _ from "lodash";

import {
  UserPayload,
  CreateUserType,
  CreateUserLogin,
  EditProfile,
  UserType,
} from "../dto";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
  GenerateSalt,
  onRequestOtp,
} from "../utility";
import {} from "./../utility/PasswordUnility";
import {
  // Grocery,
  User,
  // Transaction,
  // Order,
  // Offer,
  // Vandor,
  // DeliveryUser,
} from "../model";

export const UserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserType, req.body);
  const userInputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (userInputErrors.length > 0) {
    return res.status(400).json(userInputErrors);
  }

  const { tel, password, user_group } = userInputs;

  const existCustomer = await User.findOne({ tel: tel });
  if (existCustomer.rows.length > 0)
    return res.status(400).json({ message: "User already registered." });
  // return res.json({ existCustomer: existCustomer.rows.length });

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const user = new User({
    tel: tel,
    password: userPassword,
    first_name: "",
    last_name: "",
    email: "",
    verified: false,
    salt: salt,
    otp: otp,
    otp_expiry: expiry,
    address_line1: "",
    address_line2: "",
    city: "",
    lat: 0,
    lng: 0,
    modified_at: new Date(),
    user_group: user_group,
  } as any);

  const result = await user.create();
  if (!result) return res.status(400).send("Error Found!");

  // // send otp to customer
  // await onRequestOtp(otp, tel);

  // generate signture
  const signture = GenerateSignature({
    id: result.rows[0].id,
    tel: result.rows[0].tel,
    verified: result.rows[0].verified,
    user_group: result.rows[0].user_group,
  } as UserPayload);

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      otp: otp,
      verified: result.rows[0].verified,
      tel: result.rows[0].tel,
    });
};

export const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserLogin, req.body);
  const userInputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (userInputErrors.length > 0) {
    return res.status(400).json(userInputErrors);
  }

  const { tel, password } = userInputs;

  const existUser = await User.findOne({ tel: tel });
  if (!existUser) return res.status(400).json("Invalid phone no or password");

  const validPassword = await ValidatePassword(
    password,
    existUser.rows[0].password,
    existUser.rows[0].salt
  );

  if (!validPassword) return res.status(400).json("Invalid email or password");

  const signture = GenerateSignature({
    id: existUser.rows[0].id,
    tel: existUser.rows[0].tel,
    user_group: existUser.rows[0].user_group,
  } as UserPayload);
  res.status(200).json(signture);
};

// export const UserVerify = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { otp } = <UserType>req.body;
//   const user = <UserPayload>req.user;

//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const profile = await User.findById(user.id);
//   if (!profile) return;

//   if (profile.otp === otp && profile.otp_expiry >= new Date()) {
//     profile.verified = true;

//     const updateUserResponse = await profile.save();

//     const signture = GenerateSignature({
//       id: updateUserResponse.id,
//       tel: updateUserResponse.email,
//     });

//     res.status(201).json({
//       signture: signture,
//       verified: updateUserResponse.verified,
//       tel: updateUserResponse.tel,
//     });
//   }
// };

// export const RequestOtp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.user;
//   if (!user) return;

//   const profile = await User.findById(user.id);
//   if (!profile) return;

//   const { otp, expiry } = GenerateOtp();
//   profile.otp = otp;
//   profile.otp_expiry = expiry;

//   await profile.save();
//   await onRequestOtp(otp, profile.tel);

//   res.status(200).json({ message: "OTP is Sent via Your Phone" });
// };

export const GetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let profile = await User.findById({ id: user.id });
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });

  return res.status(200).json(profile.rows[0]);
};

export const EditUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const userInputs = plainToClass(EditProfile, req.body);
  const inputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const {
    first_name,
    last_name,
    email,
    address_line1,
    address_line2,
    city,
    lat,
    lng,
  } = <UserType>userInputs;

  let profile = (await User.findById({ id: user.id })) as any;
  if (!profile) return res.status(400).json({ message: "Invalid Vendor!" });

  profile = profile.rows[0];

  profile.first_name = first_name;
  profile.last_name = last_name;
  profile.email = email;
  profile.address_line1 = address_line1;
  profile.address_line2 = address_line2;
  profile.city = city;
  profile.lat = lat;
  profile.lng = lng;

  const result = await User.save(profile);

  res.json(
    _.pick(result.rows[0], [
      "id",
      "first_name",
      "last_name",
      "email",
      "tel",
      "address_line1",
      "address_line2",
      "city",
      "lat",
      "lng",
      "user_group",
    ])
  );
};

// // offer Section

// // export const ApplyOffer = async (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const offerId = req.params.id;
// //   const user = req.user;

// //   if (user) {
// //     let appliedOffer = await Offer.findById(offerId);
// //     if (appliedOffer) {
// //       if (appliedOffer.promoType == "USER") {
// //       } else {
// //         if (appliedOffer.isActive) {
// //           return res.json({
// //             message: "offer is Valid",
// //             appliedOffer: appliedOffer,
// //           });
// //         }
// //       }
// //     }
// //   }
// // };

// /* ---------  Assign Order for Delivery ------------*/
// const AssignDeliveryBoy = async (orderID: string, vandorID: string) => {
//   // find the vandor
//   const vandor = await Vandor.findById(vandorID);
//   if (!vandor) return;

//   let areaCode = vandor.pincode;
//   let vandorLat = vandor.lat;
//   let vandorLng = vandor.lng;

//   // find avaliable delivery Boy
//   const avaliableDelivery = await DeliveryUser.find({
//     pinCode: areaCode,
//     isAvalaible: true,
//     verified: true,
//   });

//   //cheak the nearst delivey boy and Assign
//   if (!avaliableDelivery) {
//     console.log(`Delivery person ${avaliableDelivery[0]}`);
//     return;
//   }

//   //update the delivery ID
//   const currentOrder = await Order.findById(orderID);
//   if (!currentOrder) return;

//   currentOrder.deliveryID = avaliableDelivery[0].id;
//   await currentOrder.save();
//   console.log(currentOrder);
//   // push notification using firebase
// };

// //payment section

// export const CratePayment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.body;
//   const { amount, paymentMode, offerId } = req.body;

//   if (!user) return res.status(400).send("Access Denied!");

//   let payableAmount = Number(amount);

//   if (!offerId) payableAmount = Number(amount);
//   const valuableOffer = await Offer.findById(offerId);
//   if (valuableOffer) {
//     payableAmount = payableAmount - valuableOffer.offerAmount;
//   }

//   /*
//     perform payment gatewat | create api call

//     get success / failre response

//     crate record on transaction
//   */

//   const createTransaction = await Transaction.create({
//     customer: user.id,
//     vandorId: "",
//     orderId: "",
//     orderValue: payableAmount, // amount
//     offerUsed: offerId, // offerId if Used
//     status: "OPEN",
//     paymentMode: paymentMode,
//     paymentResponse: "Cash on Delivery",
//   });

//   //return transaction Id
//   return res.json(createTransaction);
// };

// const validateTransaction = async (trnxId: string) => {
//   const currentTransaction = await Transaction.findById(trnxId);

//   if (!currentTransaction) return { status: false, currentTransaction };

//   if (!(currentTransaction.status.toLocaleLowerCase() !== "faield"))
//     return { status: true, currentTransaction };
// };

// order Section

// export const CreateOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // grab current login Customer
//   const user = <UserPayload>req.user;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const { trnxId, amount, items } = <OrderInputs>req.body;

//   //validate the transaction
//   const { status, currentTransaction } = (await validateTransaction(
//     trnxId
//   )) as any;
//   if (!status) return res.status(400).json("You Should Get valid Transaction!");

//   const profile = await User.findById(user.id).populate("orders");
//   if (!profile) throw new Error("Error in getting profile");

//   let orderID = `${Math.floor(Math.random() * 89999) + 1000}`;
//   let cartItems = Array();
//   let netAmount = 0.0;
//   let vendorId = "";

//   // grab order items from request {{id:xx, unit:xx}}

//   //calculate order amount

//   const groceries = await Grocery.find()
//     .where("id")
//     .in(items.map((item) => item._id))
//     .exec();
//   groceries.map((grocery) => {
//     items.map(({ id, unit }) => {
//       if (grocery.id == id) {
//         vendorId = grocery.vandorId;
//         netAmount += grocery.price * unit;
//         cartItems.push({ grocery, unit });
//       }
//     });
//   });

//   //create order with item description
//   if (cartItems) {
//     // create order
//     const currentOrder = await Order.create({
//       orderId: orderID,
//       vandorID: vendorId,
//       items: cartItems,
//       totalAmount: netAmount,
//       paidAmount: amount,
//       orderDate: new Date(),
//       orderStatus: "Waiting",
//       remarks: "",
//       deliveryID: "",
//       readyTime: 35,
//     });
//     profile.cart = [] as Array<any>;
//     profile.orders.push(currentOrder);

//     if (!currentTransaction) return;
//     currentTransaction.orderId = orderID;
//     currentTransaction.vandorId = vendorId;
//     currentTransaction.status = "CONFIRMED";

//     await currentTransaction.save();

//     await AssignDeliveryBoy(currentOrder.id, vendorId);
//     // finally update orders to user account
//     return res.status(200).json(await profile.save());
//   }
//   return res.json({ message: "Error" });
// };

// export const GetOrders = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let user = req.user;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let profile = await User.findById(user.id).populate("orders");
//   if (!profile) return;

//   res.json(profile);
// };

// export const GetOrderByID = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// export const AddCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let user = req.user;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let profile = await User.findById(user.id).populate("cart.grocery");
//   if (!profile) return;

//   let { product_id, quantity } = <CartItem>req.body;

//   let product = await Product.findById(product_id);
//   if (!product) return;

//   let cartItems = profile.cart;

//   /*
//    *finding if there is cart item in the profile
//    *if is length above zero ...find it index of product
//    *if is quantity > 0 update the product ans its quantity with the incoming else reove the product
//    *esle add as the new product
//    */

//   if (cartItems.length > 0) {
//     const existCartItem = cartItems.filter(
//       (item: any) => item.product._id.toString() === product_id
//     );
//     if (existCartItem.length > 0) {
//       let index = cartItems.indexOf(existCartItem[0]);

//       if (quantity > 0) {
//         cartItems[index] = { product, quantity };
//       } else {
//         cartItems.splice(index, 1);
//       }
//       // return res.json(index)
//     } else {
//       // add new item
//       cartItems.push({ product, quantity });
//     }
//   } else {
//     // add new item
//     cartItems.push({ product, quantity });
//   }
//   if (!cartItems) return res.status(400).json("Invalid Input");

//   profile.cart = cartItems;
//   await profile.save();
//   return res.json(profile);
// };

// export const GetCarts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.user;

//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const profile = await User.findById(user.id).populate("cart.product");
//   if (!profile) return;

//   return res.json(profile.cart);
// };

// export const DeleteCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.user;

//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const profile = await User.findById(user.id).populate("cart.grocery");
//   if (!profile) return;

//   profile.cart = [] as any;
//   await profile.save();
//   res.json(profile);
// };
