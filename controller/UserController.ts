import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";

import {
  UserType,
  CreateUserType,
  CartItem,
  EditProfile,
  OrderInputs,
  UserPayload,
} from "../dto";
// import { User } from "../models/User";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
  GenerateSalt,
  onRequestOtp,
} from "../utility";
import {} from "./../utility/PasswordUnility";
// import {
//   Grocery,
//   Transaction,
//   Order,
//   Offer,
//   Vandor,
//   DeliveryUser,
// } from "../models";

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

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const existCustomer = await User.findOne({ tel: tel });
  if (existCustomer)
    return res.status(400).json({ message: "User already registered." });

  const result = await User.create({
    tel: tel,
    password: userPassword,
    salt: salt,
    first_name: "",
    last_name: "",
    email: "",
    verified: false,
    oto: otp,
    otp_expiry: expiry,
    address_line1: "",
    address_line2: "",
    city: "",
    lat: 0,
    lng: 0,
    user_group: user_group,
  });

  if (!result) return res.json({ message: "Not found" });
  // send otp to customer
  await onRequestOtp(otp, tel);

  //generate signture
  const signture = GenerateSignature({
    id: result.id,
    tel: result.tel,
    verified: result.verified,
  });

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      otp: otp,
      verified: result.verified,
      tel: result.tel,
    });
};

export const UserLogin = async (
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

  const { tel, password } = userInputs;

  const existUser = await User.findOne({ tel: tel });
  if (!existUser) return res.status(400).json("Invalid phone no or password");

  const validPassword = await ValidatePassword(
    password,
    existUser.password,
    existUser.salt
  );

  if (!validPassword) return res.status(400).json("Invalid email or password");

  const signture = GenerateSignature({
    id: existUser.id,
    tel: existUser.tel,
  });
  res.status(200).json(signture);
};

export const UserVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = <UserType>req.body;
  const user = <UserPayload>req.user;

  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const profile = await User.findById(user.id);
  if (!profile) return;

  if (profile.otp === otp && profile.otp_expiry >= new Date()) {
    profile.verified = true;

    const updateUserResponse = await profile.save();

    const signture = GenerateSignature({
      id: updateUserResponse.id,
      tel: updateUserResponse.email,
    });

    res.status(201).json({
      signture: signture,
      verified: updateUserResponse.verified,
      tel: updateUserResponse.tel,
    });
  }
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = <UserPayload>req.user;
  if (!user) return;

  const profile = await User.findById(user.id);
  if (!profile) return;

  const { otp, expiry } = GenerateOtp();
  profile.otp = otp;
  profile.otp_expiry = expiry;

  await profile.save();
  await onRequestOtp(otp, profile.tel);

  res.status(200).json({ message: "OTP is Sent via Your Phone" });
};

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

  let profile = await User.findById(user.id);
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });
  return res.status(200).json(profile);
};

export const EditUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserType, req.body);
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
  } = userInputs;

  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let profile = await User.findById(user.id);
  if (!profile) return res.status(400).json({ message: "Invalid Vendor!" });

  profile.first_name = first_name;
  profile.last_name = last_name;
  profile.email = email;
  profile.address_line1 = address_line1;
  profile.address_line2 = address_line2;
  profile.city = city;
  profile.lat = lat;
  profile.lng = lng;

  await profile.save();
  res.json(profile);
};

// offer Section

// export const ApplyOffer = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const offerId = req.params.id;
//   const user = req.user;

//   if (user) {
//     let appliedOffer = await Offer.findById(offerId);
//     if (appliedOffer) {
//       if (appliedOffer.promoType == "USER") {
//       } else {
//         if (appliedOffer.isActive) {
//           return res.json({
//             message: "offer is Valid",
//             appliedOffer: appliedOffer,
//           });
//         }
//       }
//     }
//   }
// };

/* ---------  Assign Order for Delivery ------------*/
const AssignDeliveryBoy = async (orderID: string, vandorID: string) => {
  // find the vandor
  const vandor = await Vandor.findById(vandorID);
  if (!vandor) return;

  let areaCode = vandor.pincode;
  let vandorLat = vandor.lat;
  let vandorLng = vandor.lng;

  // find avaliable delivery Boy
  const avaliableDelivery = await DeliveryUser.find({
    pinCode: areaCode,
    isAvalaible: true,
    verified: true,
  });

  //cheak the nearst delivey boy and Assign
  if (!avaliableDelivery) {
    console.log(`Delivery person ${avaliableDelivery[0]}`);
    return;
  }

  //update the delivery ID
  const currentOrder = await Order.findById(orderID);
  if (!currentOrder) return;

  currentOrder.deliveryID = avaliableDelivery[0].id;
  await currentOrder.save();
  console.log(currentOrder);
  // push notification using firebase
};

//payment section

export const CratePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;
  const { amount, paymentMode, offerId } = req.body;

  if (user) {
    let payableAmount = Number(amount);

    if (offerId) {
      let valuableOffer = await Offer.findById(offerId);
      if (valuableOffer) {
        payableAmount = payableAmount - valuableOffer.offerAmount;
      }
    } else payableAmount = Number(amount);

    // perform payment gatewat | create api call

    // get success / failre response

    // crate record on transaction
    const createTransaction = await Transaction.create({
      customer: user._id,
      vandorId: "",
      orderId: "",
      orderValue: payableAmount, // amount
      offerUsed: offerId, // offerId if Used
      status: "OPEN",
      paymentMode: paymentMode,
      paymentResponse: "Cash on Delivery",
    });

    //return transaction Id
    return res.json(createTransaction);
  }
};

const validateTransaction = async (trnxId: string) => {
  const currentTransaction = await Transaction.findById(trnxId);
  if (currentTransaction) {
    if (currentTransaction.status.toLocaleLowerCase() !== "faield") {
      return { status: true, currentTransaction };
    }
  }
  return { status: false, currentTransaction };
};

// order Section

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current login Customer
  const user = req.user;
  const { trnxId, amount, items } = <OrderInputs>req.body;
  // const {trnxId, amount, items} = <[OrderInputs]>req.body

  if (user) {
    //validate transaction
    const { status, currentTransaction } = await validateTransaction(trnxId);
    // crete an order ID
    if (!status) {
      return res.status(400).json("You Should Get valid Transaction!");
    }

    const profile = await User.findById(user._id).populate("orders");
    if (profile) {
      let orderID = `${Math.floor(Math.random() * 89999) + 1000}`;
      let cartItems = Array();
      let netAmount = 0.0;
      let vendorId = "";

      // grab order items from request {{id:xx, unit:xx}}

      //calculate order amount

      const groceries = await Grocery.find()
        .where("_id")
        .in(items.map((item) => item._id))
        .exec();
      groceries.map((grocery) => {
        items.map(({ _id, unit }) => {
          if (grocery._id == _id) {
            vendorId = grocery.vandorId;
            netAmount += grocery.price * unit;
            cartItems.push({ grocery, unit });
          }
        });
      });

      //create order with item description
      if (cartItems) {
        // create order
        const currentOrder = await Order.create({
          orderId: orderID,
          vandorID: vendorId,
          items: cartItems,
          totalAmount: netAmount,
          paidAmount: amount,
          orderDate: new Date(),
          orderStatus: "Waiting",
          remarks: "",
          deliveryID: "",
          readyTime: 35,
        });
        profile.cart = [] as any;
        profile.orders.push(currentOrder);

        if (currentTransaction) {
          currentTransaction.orderId = orderID;
          currentTransaction.vandorId = vendorId;
          currentTransaction.status = "CONFIRMED";

          await currentTransaction.save();
        }

        await AssignDeliveryBoy(currentOrder._id, vendorId);
        // finally update orders to user account
        return res.status(200).json(await profile.save());
      }
      return res.json({ message: "Error" });
    }
    return res.json({ message: "Error" });
  }
  return res.json("Error in User");
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;

  if (user) {
    let profile = await User.findById(user._id).populate("orders");

    if (profile != null) {
      return res.json(profile);
    }
    return res.json("Error in profile");
  }
  return res.json("Error in User");
};

export const GetOrderByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const AddCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    let profile = await User.findById(user._id).populate("cart.grocery");

    let { _id, unit } = <CartItem>req.body;
    let grocery = await Grocery.findById(_id);

    if (grocery) {
      if (profile) {
        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let existCartItem = cartItems.filter(
            (item) => item.grocery._id.toString() === _id
          );
          if (existCartItem.length > 0) {
            let index = cartItems.indexOf(existCartItem[0]);
            if (unit > 0) {
              cartItems[index] = { grocery, unit };
            } else {
              cartItems.splice(index, 1);
            }
            // return res.json(index)
          } else {
            // add new item
            cartItems.push({ grocery, unit });
          }
        } else {
          // add new item
          cartItems.push({ grocery, unit });
        }
        if (cartItems) {
          profile.cart = cartItems;
          let cartResult = await profile.save();
          return res.json(cartResult);
        }
      }
    }
  }
  return res.status(400).json("Error in Creating -- the Cart!");
};

export const GetCarts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id).populate("cart.grocery");
    if (profile) {
      return res.json(profile.cart);
    } else {
      return res.json("Cart is Empity!");
    }
  }
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id).populate("cart.grocery");

    if (profile) {
      profile.cart = [] as any;
      let result = await profile.save();
      return res.json(result);
    } else {
      return res.json("Cart is aleardy Empity!");
    }
  }
};
