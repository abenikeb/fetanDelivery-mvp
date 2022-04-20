import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator";

export const VAT_PERCENT = 0.15;

export class CreateUserType {
  @IsNotEmpty()
  @Length(7, 15)
  tel: string;

  @Length(6, 50)
  password: string;

  @IsInt()
  user_group?: number;
}

// export class CreateUserType {
//   @IsNotEmpty()
//   @Length(7, 15)
//   tel: string;

//   @Length(6, 50)
//   password: string;

//   @IsString()
//   @Length(5, 50)
//   first_name: string;

//   @IsString()
//   @Length(2, 50)
//   last_name: string;

//   @IsEmail()
//   email: string;

//   verified?: boolean;
//   salt?: string;
//   oto?: string;
//   otp_expiry?: Date;

//   @Length(5, 250)
//   address_line1?: string;

//   @Length(5, 250)
//   address_line2?: string;

//   @Length(5, 250)
//   city?: string;

//   lat?: number;
//   lng?: number;
//   created_at: Date = new Date();
//   modified_at?: Date;

//   @IsInt()
//   user_group?: number;

//   // constructor(UserInfo: any) {
//   //   this.email = UserInfo.email;
//   //   this.tel = UserInfo.tel;
//   //   this.password = UserInfo.password;
//   //   this.first_name = UserInfo.first_name;
//   //   this.last_name = UserInfo.last_name;
//   //   this.verified = UserInfo.verified || true;
//   //   this.salt = UserInfo.salt;
//   //   this.oto = UserInfo.oto;
//   //   this.otp_expiry = UserInfo.otp_expiry;
//   //   this.address_line1 = UserInfo.address_line1;
//   //   this.address_line2 = UserInfo.address_line2;
//   //   this.city = UserInfo.city;
//   //   this.lat = UserInfo.lat;
//   //   this.lng = UserInfo.lng;
//   //   this.created_at = UserInfo.created_at;
//   //   this.modified_at = UserInfo.modified_at;
//   //   this.user_group = UserInfo.user_group;
//   // }
// }

export interface UserType {
  tel: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  verified?: boolean;
  salt?: string;
  otp: string;
  otp_expiry?: Date;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  lat?: number;
  lng?: number;
  created_at?: Date;
  modified_at?: Date;
  user_group: number;
}

export class CreateUserLogin {
  @Length(7, 15)
  tel: string;

  @Length(6, 250)
  password: string;

  constructor(UserInfo: any) {
    this.tel = UserInfo.tel;
    this.password = UserInfo.password;
  }
}

export class EditProfile {
  @Length(7, 50)
  first_name: string;

  @Length(7, 50)
  last_name: string;

  @IsEmail()
  email: string;

  @Length(7, 15)
  tel: string;

  @Length(6, 250)
  password: string;

  address_line1: string;
  address_line2: string;
  city: string;
  lat?: number;
  lng?: number;
  created_at: Date;
  modified_at: Date;
  user_group: number;

  constructor(UserInfo: any) {
    this.email = UserInfo.email;
    this.tel = UserInfo.tel;
    this.password = UserInfo.password;
    this.first_name = UserInfo.first_name;
    this.last_name = UserInfo.last_name;
    this.address_line1 = UserInfo.address_line1;
    this.address_line2 = UserInfo.address_line2;
    this.city = UserInfo.city;
    this.lat = UserInfo.lat;
    this.lng = UserInfo.lng;
    this.created_at = UserInfo.created_at;
    this.modified_at = UserInfo.modified_at;
    this.user_group = UserInfo.user_group;
  }
}

export interface UserPayload {
  id: number;
  tel: string;
  verified?: boolean;
}

// export class OrderInputs {
//   trnxId: string;
//   amount: number;
//   items: [CartItem];
// }

export interface CartItem {
  product_id: number;
  quantity: number;
  user_id: number;
}

// export class DeliveryUserSignup {
//   @Length(7, 12)
//   tel?: string;

//   @Length(6, 50)
//   password?: string;

//   @Length(7, 12)
//   firstName?: string;

//   @Length(6, 12)
//   lastName?: string;

//   @Length(7, 250)
//   address?: string;

// }

// export class CreateDeliveryUserLogin {
//   @IsEmail()
//   email: string;

//   @Length(6, 12)
//   password: string;
// }

export enum OrderStatusState {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DELIVERED = "delivered",
  CANCLED = "cancled",
}

export interface OrderItems {
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface OrderPrice {
  netPrice: number;
  addedTax: number;
  grossPrice?: number;
}

export class CreateOrderType {
  netPrice?: number;
  addedTax?: number;
  grossPrice?: number;
  remarks?: string;
  user_id?: string;
  status?: number;
  vender_id?: number;
  payment_via?: string;
  delivery_boy?: number;
  created_at: Date = new Date();
  modified_at?: Date;

  // constructor(order: Order) {
  //   this.netPrice = order.netPrice;
  //   this.addedTax = order.addedTax;
  //   this.user_id = order.user_id;
  //   this.vender_id = order.vender_id;
  //   this.payment_via = order.payment_via;
  //   this.delivery_boy = order.delivery_boy;
  //   this.modified_at = order.modified_at;

  //   this.status = order.status || 1;
  //   /** Calculate the default price from the total price */
  //   this.grossPrice = GenerateOrderPrice(
  //     // Calculate Net Price
  //     this.netPrice
  //   ).grossPrice;
  //   this.remarks = order.remarks;
  // }
}

export interface OrderType {
  netPrice: number;
  addedTax?: number;
  grossPrice?: number;
  remarks?: string;
  user_id: string;
  status?: number;
  vender_id: number;
  payment_via: string;
  delivery_boy: number;
  created_at: Date;
  modified_at?: Date;
}

// export class OrderNotification {
//   id?: string;
//   orderId: string;
//   userId: string;
//   message: string;
//   isRead?: boolean;
//   type?: Readonly<string> = ORDER_NOTIFICATION_COLLECTION;
//   receiverId?: string;
//   status?: number;
//   content?: string;
//   receiverType: OrderReceiverType;
//   dateTime?: firebase.firestore.Timestamp;

//   constructor(orderNotification: OrderNotification) {
//     this.orderId = orderNotification.orderId;
//     this.userId = orderNotification.userId;
//     this.message = orderNotification.message;
//     this.receiverId = orderNotification.userId;
//     this.status = 1;
//     this.content = orderNotification.message;
//     this.receiverType = orderNotification.receiverType;
//     this.dateTime = firebase.firestore.Timestamp.now();

//     this.isRead = orderNotification.isRead || false;
//   }

//   getType?() {
//     return this.type;
//   }
// }

// Helpers
export const GenerateOrderPrice = (netPrice: number): OrderPrice => {
  const orderPrice: OrderPrice = {
    netPrice,
    addedTax: VAT_PERCENT * netPrice,
  };

  orderPrice.grossPrice = orderPrice.addedTax + orderPrice.netPrice;

  return orderPrice;
};

// export class EditProfile {
//   @Length(7, 50)
//   first_name: string;

//   @Length(7, 50)
//   last_name: string;

//   @IsEmail()
//   email: string;

//   @Length(7, 15)
//   tel: string;

//   @Length(6, 250)
//   password: string;

//   verified: boolean;
//   salt: string;
//   oto: string;
//   otp_expiry: Date;
//   address_line1: string;
//   address_line2: string;
//   city: string;
//   lat: number;
//   lng: number;
//   created_at: Date;
//   modified_at: Date;
//   user_group: number;

//   constructor(UserInfo: any) {
//     this.email = UserInfo.email;
//     this.tel = UserInfo.tel;
//     this.password = UserInfo.password;
//     this.first_name = UserInfo.first_name;
//     this.last_name = UserInfo.last_name;
//     this.verified = UserInfo.verified;
//     this.salt = UserInfo.salt;
//     this.oto = UserInfo.oto;
//     this.otp_expiry = UserInfo.otp_expiry;
//     this.address_line1 = UserInfo.address_line1;
//     this.address_line2 = UserInfo.address_line2;
//     this.city = UserInfo.city;
//     this.lat = UserInfo.lat;
//     this.lng = UserInfo.lng;
//     this.created_at = UserInfo.created_at;
//     this.modified_at = UserInfo.modified_at;
//     this.user_group = UserInfo.user_group;
//   }
// }
